// Spoonacular API shapes
export interface SpoonacularSearchResult {
  id: number;
  title: string;
  image: string;
  imageType: string;
}

export interface SpoonacularSearchResponse {
  results: SpoonacularSearchResult[];
  offset: number;
  number: number;
  totalResults: number;
}

export interface SpoonacularIngredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  originalName: string;
  // grams equivalent
  measures: {
    metric: { amount: number; unitShort: string };
    us: { amount: number; unitShort: string };
  };
}

export interface SpoonacularRecipeDetail {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  diets: string[];
  dishTypes: string[];
  occasions: string[];
  nutrition?: { nutrients: Array<{ name: string; amount: number; unit: string }> };
  extendedIngredients: SpoonacularIngredient[];
  analyzedInstructions: Array<{
    name: string;
    steps: Array<{ number: number; step: string }>;
  }>;
}

// Our internal app model (mapped from Spoonacular)
export interface Ingredient {
  name: string;
  amountGrams: number;
  unit: string;
  originalAmount: number;
  originalUnit: string;
}

export interface Recipe {
  id: string;
  title: string;
  image: string;
  prepTime: number;
  servings: number;
  calories: number;
  tags: string[];
  diet: 'vegetarian' | 'vegan' | 'omnivore';
  description: string;
  ingredients: Ingredient[];
  steps: string[];
}

export interface ShoppingItem {
  recipeId: string;
  recipeTitle: string;
  ingredient: Ingredient;
}
