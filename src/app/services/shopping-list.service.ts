import { Injectable, signal, computed } from '@angular/core';
import { ShoppingItem, Recipe } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  private itemsSignal = signal<ShoppingItem[]>([]);

  items = this.itemsSignal.asReadonly();
  totalCount = computed(() => this.itemsSignal().length);

  addRecipe(recipe: Recipe): void {
    // Remove existing items from this recipe first (toggle off)
    const existing = this.itemsSignal().filter(i => i.recipeId === recipe.id);
    if (existing.length) { this.removeRecipe(recipe.id); return; }

    const newItems: ShoppingItem[] = recipe.ingredients.map(ing => ({
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      ingredient: ing
    }));
    this.itemsSignal.update(items => [...items, ...newItems]);
  }

  removeRecipe(recipeId: string): void {
    this.itemsSignal.update(items => items.filter(i => i.recipeId !== recipeId));
  }

  removeItem(recipeId: string, ingredientName: string): void {
    this.itemsSignal.update(items =>
      items.filter(i => !(i.recipeId === recipeId && i.ingredient.name === ingredientName))
    );
  }

  hasRecipe(recipeId: string): boolean {
    return this.itemsSignal().some(i => i.recipeId === recipeId);
  }

  clearAll(): void { this.itemsSignal.set([]); }

  groupedByRecipe(): Map<string, ShoppingItem[]> {
    const map = new Map<string, ShoppingItem[]>();
    for (const item of this.itemsSignal()) {
      if (!map.has(item.recipeId)) map.set(item.recipeId, []);
      map.get(item.recipeId)!.push(item);
    }
    return map;
  }
}
