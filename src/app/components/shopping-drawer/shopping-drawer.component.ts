import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../services/shopping-list.service';
import { GramsToOuncesPipe } from '../../pipes/grams-to-ounces.pipe';

@Component({
  selector: 'app-shopping-drawer',
  standalone: true,
  imports: [CommonModule, GramsToOuncesPipe],
  templateUrl: './shopping-drawer.component.html',
  styleUrl: './shopping-drawer.component.scss',
})
export class ShoppingDrawerComponent {
  @Input()  isOpen = false;
  @Output() close  = new EventEmitter<void>();

  shopping = inject(ShoppingListService);
  unit     = 'metric';

  groupedEntries() {
    const map = this.shopping.groupedByRecipe();
    return Array.from(map.entries()).map(([recipeId, items]) => ({
      recipeId,
      title: items[0].recipeTitle,
      items,
    }));
  }
}
