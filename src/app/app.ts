import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged, filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { RecipeService } from './services/recipe.service';
import { ShoppingListService } from './services/shopping-list.service';
import { Recipe } from './models/recipe.model';
import { RecipeCardComponent } from './components/recipe-card/recipe-card.component';
import { RecipeDetailDialogComponent } from './components/recipe-detail-dialog/recipe-detail-dialog.component';
import { ShoppingDrawerComponent } from './components/shopping-drawer/shopping-drawer.component';

type FilterType = 'all' | 'quick' | 'vegetarian' | 'healthy';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RecipeCardComponent, ShoppingDrawerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private recipeService = inject(RecipeService);
  private dialog = inject(MatDialog);
  shopping = inject(ShoppingListService);

  searchQuery = '';
  drawerOpen = false;
  activeFilter: FilterType = 'all';

  heroShrunk = signal(false);
  loading    = signal(false);
  error      = signal(false);
  recipes    = signal<Recipe[]>([]);
  lastQuery  = signal('');

  private search$ = new Subject<string>();
  private sub!: Subscription;

  ngOnInit(): void {
    // RxJS switchMap — cancels previous in-flight request on new keystroke
    this.sub = this.search$.pipe(
      filter(q => q.trim().length > 1),
      debounceTime(600),
      distinctUntilChanged(),
      switchMap(query => {
        this.loading.set(true);
        this.error.set(false);
        this.recipes.set([]);
        this.lastQuery.set(query);
        return this.recipeService.searchRecipes(query);
      })
    ).subscribe({
      next:  recipes => { this.loading.set(false); this.recipes.set(recipes); },
      error: ()      => { this.loading.set(false); this.error.set(true); },
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  onQueryChange(value: string): void {
    if (value.trim().length > 1) {
      this.heroShrunk.set(true);
    } else if (!value.trim()) {
      this.heroShrunk.set(false);
      this.recipes.set([]);
      this.error.set(false);
    }
    this.search$.next(value);
  }

  setFilter(f: FilterType): void { this.activeFilter = f; }

  filteredRecipes(): Recipe[] {
    const all = this.recipes();
    switch (this.activeFilter) {
      case 'quick':       return all.filter(r => r.prepTime < 30);
      case 'vegetarian':  return all.filter(r => r.diet === 'vegetarian' || r.diet === 'vegan' || r.tags.includes('vegetarian'));
      case 'healthy':     return all.filter(r => r.tags.includes('healthy') || r.tags.includes('light'));
      default:            return all;
    }
  }

  openDialog(recipe: Recipe): void {
    this.dialog.open(RecipeDetailDialogComponent, {
      data: { recipe },
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'recipe-dialog',
    });
  }
}
