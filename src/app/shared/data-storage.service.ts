import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { RecipeService } from "../recipes/recipe.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private http:HttpClient, private recipeService:RecipeService){}

    storeRecipes(){
        const recipes = this.recipeService.getRecipes();

        recipes.forEach((recipe, index) => {
            console.log(`Recipe ${index + 1}:`);
            console.log(`  Name: ${recipe.name}`);
            console.log(`  Description: ${recipe.description}`);
            console.log(`  Image: ${recipe.imagePath}`);
            console.log(`  Ingredients:`);
            recipe.ingredients.forEach((ingredient, i) => {
              console.log(`    ${i + 1}. ${ingredient.name} - ${ingredient.amount}`);
            });
          });

        this.http.put('https://ng-course-recipe-book-2c961-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', recipes)
        .subscribe({
            next: (response) => {
              console.log('Sauvegarde réussie :', response);
            },
            error: (error) => {
              console.error('Erreur lors de la sauvegarde :', error);
            }
          });
    }
}