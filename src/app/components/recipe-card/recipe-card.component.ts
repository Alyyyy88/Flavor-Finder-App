import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';
import { ShoppingListService } from '../../services/shopping-list.service';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
})
export class RecipeCardComponent {
  @Input() recipe!: Recipe;
  @Output() openDetail = new EventEmitter<Recipe>();

  isFav    = false;
  imgError = false;

  private shopping = inject(ShoppingListService);

  get isInList(): boolean { return this.shopping.hasRecipe(this.recipe.id); }

  onCardClick(): void                { this.openDetail.emit(this.recipe); }
  toggleFav(e: Event): void          { e.stopPropagation(); this.isFav = !this.isFav; }
  toggleList(e: Event): void         { e.stopPropagation(); this.shopping.addRecipe(this.recipe); }
  onImgError(e: Event): void         { this.imgError = true; (e.target as HTMLImageElement).style.display = 'none'; }
}
