import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Recipe } from '../../models/recipe.model';
import { ShoppingListService } from '../../services/shopping-list.service';
import { GramsToOuncesPipe } from '../../pipes/grams-to-ounces.pipe';

@Component({
  selector: 'app-recipe-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatDividerModule, GramsToOuncesPipe],
  templateUrl: './recipe-detail-dialog.component.html',
  styleUrl: './recipe-detail-dialog.component.scss',
})
export class RecipeDetailDialogComponent {
  unit     = 'metric';
  imgError = false;

  get isInList(): boolean { return this.shopping.hasRecipe(this.data.recipe.id); }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { recipe: Recipe },
    private dialogRef: MatDialogRef<RecipeDetailDialogComponent>,
    private shopping: ShoppingListService,
  ) {}

  addAllIngredients(): void {
    this.shopping.addRecipe(this.data.recipe);
    this.dialogRef.close();
  }

  onImgError(e: Event): void { this.imgError = true; (e.target as HTMLImageElement).style.display = 'none'; }
  close(): void              { this.dialogRef.close(); }
}
