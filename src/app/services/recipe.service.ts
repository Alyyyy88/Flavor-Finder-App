import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import {
  Recipe, Ingredient,
  SpoonacularSearchResponse,
  SpoonacularRecipeDetail
} from '../models/recipe.model';



const SPOONACULAR_API_KEY = 'cb241afd1794458da5831b04c15bd1ad';


@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly BASE = 'https://api.spoonacular.com';

  constructor(private http: HttpClient) {}

  searchRecipes(query: string): Observable<Recipe[]> {
    // Hna bn3mel search 3ala 4kl Query (bghez el parameters)
    const searchParams = new HttpParams()
      .set('apiKey', SPOONACULAR_API_KEY)
      .set('query', query)
      .set('number', '9')
      .set('addRecipeInformation', 'true')
      .set('addRecipeNutrition', 'true')
      .set('fillIngredients', 'true')
      .set('instructionsRequired', 'true');

    return this.http.get<SpoonacularSearchResponse>(
      `${this.BASE}/recipes/complexSearch`, { params: searchParams }
    ).pipe(
      switchMap(searchRes => {
        if (!searchRes.results?.length) return of([]);
       // hna hageb el full details 
        const ids = searchRes.results.map(r => r.id).join(',');
           // da bnghez el second request
        const detailParams = new HttpParams()
          .set('apiKey', SPOONACULAR_API_KEY)
          .set('ids', ids)
          .set('includeNutrition', 'true');
        //Details Request
        return this.http.get<SpoonacularRecipeDetail[]>(
          `${this.BASE}/recipes/informationBulk`, { params: detailParams }
        );
      }),
       // map to recipe 34an 4kl el api 
      map((details: SpoonacularRecipeDetail[]) => details.map(d => this.mapToRecipe(d))),
      catchError(err => { throw err; })
    );
  }

  private mapToRecipe(d: SpoonacularRecipeDetail): Recipe {
     // bn4of tl type
    let diet: 'vegetarian' | 'vegan' | 'omnivore' = 'omnivore';
    if (d.diets?.includes('vegan')) diet = 'vegan';
    else if (d.diets?.includes('vegetarian')) diet = 'vegetarian';

    // Build tags 
    const tags = [
      ...(d.diets || []).slice(0, 2),// dy spread operator bta5od el 7agat elly gaya mn array mn server w to7toha fe new array
      ...(d.dishTypes || []).slice(0, 2),
      d.readyInMinutes <= 30 ? 'quick' : '',
    ].filter(Boolean).slice(0, 4) as string[];

    // Calories from nutrition
    const calNutrient = d.nutrition?.nutrients?.find(n => n.name === 'Calories');
    const calories = calNutrient ? Math.round(calNutrient.amount) : 0;

    // bn5aly 4kl el html kowis
    const description = (d.summary || '')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .split('. ').slice(0, 2).join('. ') + '.';

    // Map ingredients
    const ingredients: Ingredient[] = (d.extendedIngredients || []).map(ing => ({
      name: ing.name || ing.originalName,
      amountGrams: Math.round(ing.measures?.metric?.amount ?? ing.amount),
      unit: ing.measures?.metric?.unitShort || ing.unit,
      originalAmount: ing.amount,
      originalUnit: ing.unit,
    }));

    // Flatten steps
    const steps: string[] = (d.analyzedInstructions || [])
      .flatMap(block => block.steps || [])
      .map(s => s.step);

    return {
      id: String(d.id),
      title: d.title,
      image: d.image,
      prepTime: d.readyInMinutes,
      servings: d.servings,
      calories,
      tags,
      diet,
      description,
      ingredients,
      steps,
    };
  }
}
