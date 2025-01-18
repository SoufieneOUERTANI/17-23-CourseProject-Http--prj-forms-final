# 1723CourseProjectHttpPrjFormsFinal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## 598. Backend (Firebase) Setup

    https://console.firebase.google.com/project/ng-course-recipe-book-2c961/overview
    https://ng-course-recipe-book-2c961-default-rtdb.europe-west1.firebasedatabase.app/


## 599. Setting up the DataStorage service


### **Règle générale pour l'utilisation de `@Injectable` avec les services Angular :**

1. **Quand `@Injectable` est obligatoire :**
   - Le décorateur `@Injectable` est **nécessaire** si le service dépend d'un autre service via l'injection de dépendances. Cela permet à Angular de gérer et de fournir les services nécessaires au bon fonctionnement du service.
   - **Exemple :**
     ```typescript
     @Injectable({
       providedIn: 'root', // Fournit le service à l'ensemble de l'application
     })
     export class DataStorageService {
       constructor(private http: HttpClient) {} // HttpClient est injecté ici
     }
     ```
   - **Important :** Lorsque vous utilisez `HttpClient`, il est essentiel d'importer le module `HttpClientModule` dans `AppModule` :
     ```typescript
     import { NgModule } from '@angular/core';
     import { BrowserModule } from '@angular/platform-browser';
     import { HttpClientModule } from '@angular/common/http';

     @NgModule({
       declarations: [...],
       imports: [
         BrowserModule,
         HttpClientModule, // Ajoutez ce module ici
       ],
       bootstrap: [...],
     })
     export class AppModule {}
     ```

2. **Quand `@Injectable` est optionnel :**
   - Si un service ne dépend d'aucun autre service, le décorateur `@Injectable` est **techniquement optionnel**. Le service fonctionnera même sans ce décorateur.
   - **Exemple sans dépendances :**
     ```typescript
     export class LoggerService {
       log(message: string) {
         console.log(message);
       }
     }
     ```

3. **Bonne pratique :**
   - **Utilisez systématiquement `@Injectable`, même si le service n'a pas de dépendances.**
   - Cela garantit une **cohérence** dans le code et prépare le service à d'éventuelles évolutions (par exemple, si vous ajoutez une dépendance plus tard).

4. **Utilisation de `providedIn`:**
   - Lorsque vous utilisez `@Injectable`, préférez la déclaration avec `providedIn: 'root'`. Cela rend le service disponible à l'échelle de l'application sans avoir à l'ajouter manuellement dans le tableau `providers` du module.
   - **Exemple avec `providedIn`:**
     ```typescript
     @Injectable({
       providedIn: 'root',
     })
     export class RecipeService {
       // Pas besoin d'ajouter ce service à "providers"
     }
     ```

5. **Alternative sans `providedIn`:**
   - Vous pouvez également omettre `providedIn` et déclarer manuellement le service dans le tableau `providers` du module concerné. Cependant, cette méthode est plus ancienne et moins utilisée dans les projets modernes Angular.
   - **Exemple :**
     ```typescript
     @Injectable()
     export class ShoppingListService {}
     ```

     Puis, dans le module :
     ```typescript
     @NgModule({
       providers: [ShoppingListService],
     })
     export class AppModule {}
     ```

---

### **Résumé de la règle :**
- **Ajoutez toujours `@Injectable` à vos services**, même si aucune dépendance n’est injectée. Cela améliore la cohérence et prépare le service à d’éventuels changements.
- Utilisez de préférence `@Injectable({ providedIn: 'root' })` pour simplifier la déclaration et rendre le service disponible globalement.
- **Si vous utilisez un service comme `HttpClient`, n'oubliez pas d'importer `HttpClientModule` dans `AppModule`** à la fois en haut et dans la section `imports`.
- Déclarez manuellement les services dans le tableau `providers` uniquement si vous avez un besoin spécifique ou si vous ciblez un module particulier.