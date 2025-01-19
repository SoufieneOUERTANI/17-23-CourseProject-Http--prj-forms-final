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


# 598. Backend (Firebase) Setup

    https://console.firebase.google.com/project/ng-course-recipe-book-2c961/overview

    Lien http pour les appels http Angular 
    https://ng-course-recipe-book-2c961-default-rtdb.europe-west1.firebasedatabase.app/
### Exemple
```typescript
this.http.put(
  'https://ng-course-recipe-book-2c961-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
  recipes
)
.subscribe({
  next: (response) => {
    console.log('Sauvegarde réussie :', response);
  },
  error: (error) => {
    console.error('Erreur lors de la sauvegarde :', error);
  }
});
```
        



# 599. Setting up the DataStorage service


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

# 600 - Storing recipes


## **Gestion des Observables dans Angular : Souscription dans le Service vs Souscription dans le Composant**

### **Contexte :**
Dans Angular, une requête HTTP via le service `HttpClient` retourne un **observable**, qui représente une opération asynchrone. Cet observable émettra une notification lorsque la réponse sera reçue ou qu'une erreur se produira. Selon le besoin, on peut souscrire à cet observable directement dans le service ou dans le composant.

---

### **Qu'est-ce qu'un observable dans ce cas précis ?**
Un **observable** est créé par la méthode `put` d'`HttpClient` :
```typescript
this.http.put('https://your-backend-url/recipes.json', recipes);
```
- **`this.http.put()`** retourne un observable.
- Cet observable émet :
  - **`next`** : Lorsqu'une réponse du serveur est reçue.
  - **`error`** : En cas d'échec (par exemple, problème réseau ou serveur inaccessible).
  - **`complete`** (optionnel) : Lorsque l'opération est terminée.

---

### **1. Souscription dans le service**

Cette méthode est utilisée lorsque :
- La réponse du serveur n'a pas besoin d'être manipulée ou affichée dans le composant.
- Le composant ne se soucie pas de l'état ou des résultats de la requête.

#### **Dans le service `DataStorageService` :**
```typescript
storeRecipes() {
  const recipes = this.recipeService.getRecipes(); // Récupérer les recettes
  this.http.put('https://your-backend-url/recipes.json', recipes)
    .subscribe(response => {
      console.log('Données sauvegardées avec succès :', response);
    });
}
```
- L'observable est souscrit directement dans le service.
- Le composant n’a pas besoin de gérer l’état de la requête.

#### **Dans le composant `HeaderComponent` :**
```typescript
onSaveData() {
  this.dataStorageService.storeRecipes();
}
```
- La méthode `onSaveData` appelle simplement `storeRecipes` du service.

#### **Dans le template HTML de `HeaderComponent` :**
```html
<button (click)="onSaveData()">Enregistrer</button>
```
- Ce bouton déclenche l'enregistrement des données via `onSaveData`.

---

### **2. Retourner l'observable et souscrire dans le composant**

Cette méthode est utilisée lorsque :
- Le composant doit gérer l’état de la requête (par exemple, afficher un spinner ou gérer les erreurs).
- La réponse du serveur est importante pour le composant.

#### **Dans le service `DataStorageService` :**
```typescript
storeRecipes() {
  const recipes = this.recipeService.getRecipes();
  return this.http.put('https://your-backend-url/recipes.json', recipes);
}
```
- Ici, la méthode retourne l’observable au lieu de souscrire directement.

#### **Dans le composant `HeaderComponent` :**
```typescript
onSaveData() {
  this.isLoading = true; // Activer le spinner
  this.dataStorageService.storeRecipes().subscribe({
    next: response => {
      console.log('Données sauvegardées :', response);
      this.isLoading = false; // Désactiver le spinner
    },
    error: error => {
      console.error('Erreur lors de la sauvegarde :', error);
      this.isLoading = false; // Désactiver le spinner en cas d'erreur
    }
  });
}
```
- La méthode `onSaveData` souscrit à l’observable retourné par le service.
- Une propriété `isLoading` est utilisée pour gérer l’état de chargement.

#### **Dans le template HTML de `HeaderComponent` :**
```html
<button (click)="onSaveData()">Enregistrer</button>
<div *ngIf="isLoading">Chargement...</div>
```
- Un message "Chargement..." s'affiche pendant que la requête est en cours.

---

### **Résumé des deux approches :**

| **Critère**                           | **Souscription dans le service**         | **Souscription dans le composant**      |
|---------------------------------------|------------------------------------------|------------------------------------------|
| **Responsabilité**                    | Le service gère la requête et la réponse | Le composant gère l'état et la réponse  |
| **Affichage d’un spinner ou message** | Non possible directement                | Possible grâce à l'état du composant     |
| **Complexité**                        | Simple pour le composant                | Plus de contrôle, mais plus complexe     |
| **Réutilisation dans plusieurs endroits** | Limité si la logique est fixe           | Plus flexible et personnalisable         |

---

### **Exemple complet et consolidé :**

**Service : `DataStorageService`**
```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from './recipe.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http.put('https://your-backend-url/recipes.json', recipes);
  }
}
```

**Composant : `HeaderComponent`**
```typescript
import { Component } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  isLoading = false;

  constructor(private dataStorageService: DataStorageService) {}

  onSaveData() {
    this.isLoading = true; // Activer le spinner
    this.dataStorageService.storeRecipes().subscribe({
      next: response => {
        console.log('Données sauvegardées :', response);
        this.isLoading = false; // Désactiver le spinner
      },
      error: error => {
        console.error('Erreur :', error);
        this.isLoading = false; // Désactiver le spinner en cas d'erreur
      }
    });
  }
}
```

**Template HTML : `header.component.html`**
```html
<button (click)="onSaveData()">Enregistrer</button>
<div *ngIf="isLoading">Chargement...</div>
```

---

### **Pourquoi choisir l'une ou l'autre approche ?**

- **Souscription dans le service** : Idéal pour des requêtes simples ou lorsque la réponse du backend n'est pas directement utilisée par le composant.
- **Souscription dans le composant** : Plus adaptée si l'interface utilisateur doit réagir à l'état de la requête ou à sa réponse.





---


La différence entre ces deux lignes de code réside dans **comment l'événement `(click)` est traité** en Angular. Voici une explication détaillée :

---

### **1. Sans parenthèses : `(click)="onSaveData"`**
```html
<li><a style="cursor: pointer;" (click)="onSaveData">Save Data</a></li>
```

#### Ce que cela fait :
- **Angular interprète `onSaveData` comme une référence** à la fonction dans le composant, **sans l'exécuter immédiatement**.
- Lorsque l'utilisateur clique, Angular n'appelle pas directement la méthode car il attend une exécution explicite. Résultat : **aucune action n'est effectuée lors du clic.**

#### Problème :
- Cette syntaxe est incorrecte pour appeler une méthode, car vous ne demandez pas explicitement à Angular d'exécuter `onSaveData`.
- Angular ne déclenche pas la méthode, et rien ne se passe.

#### Exemple où cela fonctionnerait :
- Si `onSaveData` était une **propriété contenant une fonction**, comme :
  ```typescript
  onSaveData = () => {
    console.log('Save Data triggered');
  };
  ```
  Dans ce cas, `(click)="onSaveData"` ferait référence à cette fonction anonyme, et elle serait exécutée.

---

### **2. Avec parenthèses : `(click)="onSaveData()"`**
```html
<li><a style="cursor: pointer;" (click)="onSaveData()">Save Data</a></li>
```

#### Ce que cela fait :
- **Les parenthèses `()` indiquent un appel de fonction.**
- Lorsque l'utilisateur clique sur le lien, Angular **exécute immédiatement la méthode `onSaveData()` définie dans le composant**.

#### Comportement attendu :
- Si `onSaveData()` est défini comme une méthode dans le composant Angular :
  ```typescript
  onSaveData() {
    console.log('Save Data triggered');
  }
  ```
  La méthode sera appelée normalement, et le message "Save Data triggered" sera affiché dans la console lors du clic.

---

### **Différences principales :**

| Syntaxe                               | Fonctionnement                                              | Résultat attendu                                      |
|---------------------------------------|------------------------------------------------------------|------------------------------------------------------|
| **`(click)="onSaveData"`**            | Passe une **référence** à la fonction, mais ne l'exécute pas directement. | Ne fonctionne pas, sauf si `onSaveData` est une propriété fonctionnelle. |
| **`(click)="onSaveData()"`**          | **Appelle directement** la méthode définie dans le composant. | La méthode est exécutée normalement.                |

---

### **Conclusion :**
- Utilisez toujours `(click)="onSaveData()"` pour appeler une méthode dans un composant Angular.
- `(click)="onSaveData"` ne fonctionnera que si `onSaveData` est une **propriété contenant une fonction**, ce qui est rare en Angular. 

## **Différence entre appeler une méthode avec ou sans parenthèses dans Angular**

La différence entre ces deux lignes de code réside dans **comment l'événement `(click)` est traité** en Angular. Voici une explication détaillée :

---

### **1. Sans parenthèses : `(click)="onSaveData"`**
```html
<li><a style="cursor: pointer;" (click)="onSaveData">Save Data</a></li>
```

#### Ce que cela fait :
- **Angular interprète `onSaveData` comme une référence** à la fonction dans le composant, **sans l'exécuter immédiatement**.
- Lorsque l'utilisateur clique, Angular n'appelle pas directement la méthode car il attend une exécution explicite. Résultat : **aucune action n'est effectuée lors du clic.**

#### Problème :
- Cette syntaxe est incorrecte pour appeler une méthode, car vous ne demandez pas explicitement à Angular d'exécuter `onSaveData`.
- Angular ne déclenche pas la méthode, et rien ne se passe.

#### Exemple où cela fonctionnerait :
- Si `onSaveData` était une **propriété contenant une fonction**, comme :
  ```typescript
  onSaveData = () => {
    console.log('Save Data triggered');
  };
  ```
  Dans ce cas, `(click)="onSaveData"` ferait référence à cette fonction anonyme, et elle serait exécutée.

---

### **2. Avec parenthèses : `(click)="onSaveData()"`**
```html
<li><a style="cursor: pointer;" (click)="onSaveData()">Save Data</a></li>
```

#### Ce que cela fait :
- **Les parenthèses `()` indiquent un appel de fonction.**
- Lorsque l'utilisateur clique sur le lien, Angular **exécute immédiatement la méthode `onSaveData()` définie dans le composant**.

#### Comportement attendu :
- Si `onSaveData()` est défini comme une méthode dans le composant Angular :
  ```typescript
  onSaveData() {
    console.log('Save Data triggered');
  }
  ```
  La méthode sera appelée normalement, et le message "Save Data triggered" sera affiché dans la console lors du clic.

---

### **Différences principales :**

| Syntaxe                               | Fonctionnement                                              | Résultat attendu                                      |
|---------------------------------------|------------------------------------------------------------|------------------------------------------------------|
| **`(click)="onSaveData"`**            | Passe une **référence** à la fonction, mais ne l'exécute pas directement. | Ne fonctionne pas, sauf si `onSaveData` est une propriété fonctionnelle. |
| **`(click)="onSaveData()"`**          | **Appelle directement** la méthode définie dans le composant. | La méthode est exécutée normalement.                |

---

### **Conclusion :**
- Utilisez toujours `(click)="onSaveData()"` pour appeler une méthode dans un composant Angular.
- `(click)="onSaveData"` ne fonctionnera que si `onSaveData` est une **propriété contenant une fonction**, ce qui est rare en Angular. 

---
## **Règle Générale pour Sauvegarder des Données dans Firebase Realtime Database avec Angular**
---

### **Règle générale pour sauvegarder des données dans Firebase**

#### **1. Structure de la requête HTTP**
La méthode `PUT` est utilisée pour **remplacer** les données sous un nœud spécifique de Firebase. Voici les étapes générales :

```typescript
this.http.put('<FIREBASE_DATABASE_URL>/<NODE>.json', <DATA>)
  .subscribe({
    next: (response) => {
      console.log('Données sauvegardées avec succès :', response);
    },
    error: (error) => {
      console.error('Erreur lors de la sauvegarde :', error);
    }
  });
```

#### **2. Explications des paramètres :**
- **`<FIREBASE_DATABASE_URL>`** : L'URL de votre base Firebase, visible dans la console Firebase. Elle suit généralement le format suivant :
  ```
  https://<PROJECT_ID>-default-rtdb.<REGION>.firebasedatabase.app/
  ```
  Exemple :  
  ```
  https://ng-course-recipe-book-2c961-default-rtdb.europe-west1.firebasedatabase.app/
  ```

- **`<NODE>`** : Le nœud où vous souhaitez sauvegarder les données. Par exemple :
  - `recipes.json` pour sauvegarder les recettes sous un nœud `recipes`.

- **`<DATA>`** : Les données à sauvegarder. Elles doivent être sérialisables en JSON, comme un tableau ou un objet.

---

#### **3. Exemple concret : Sauvegarder des recettes**
Si vous avez un tableau de recettes :

```typescript
const recipes = [
  {
    name: 'Tasty Schnitzel',
    description: 'A super-tasty Schnitzel - just awesome!',
    imagePath: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
    ingredients: [
      { name: 'Meat', amount: 1 },
      { name: 'French Fries', amount: 20 }
    ]
  },
  {
    name: 'Big Fat Burger',
    description: 'What else you need to say?',
    imagePath: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
    ingredients: [
      { name: 'Buns', amount: 2 },
      { name: 'Meat', amount: 1 }
    ]
  }
];
```

Vous pouvez les sauvegarder dans Firebase avec :

```typescript
this.http.put(
  'https://ng-course-recipe-book-2c961-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
  recipes
).subscribe({
  next: (response) => {
    console.log('Données sauvegardées avec succès :', response);
  },
  error: (error) => {
    console.error('Erreur lors de la sauvegarde :', error);
  }
});
```

---

#### **4. Configurer les règles Firebase (important)**
Firebase applique des règles de sécurité pour protéger vos données. Pour autoriser temporairement l’écriture publique pendant vos tests, utilisez les règles suivantes dans la console Firebase :

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

> ⚠️ **Attention** : Ne laissez jamais ces règles en production. Adaptez-les selon les besoins (par exemple, authentification requise).

---

#### **5. Points importants à noter :**
- **`PUT` remplace les données existantes** :
  Si des données existent déjà sous le nœud `recipes`, elles seront **écrasées** par la requête.
  
- **Authentification Firebase** :
  Si votre base de données exige une authentification, vous devez inclure un **token d'authentification** dans la requête HTTP.

---

### **Règle générale simplifiée :**
```typescript
this.http.put('<FIREBASE_DATABASE_URL>/<NODE>.json', <DATA>)
```

Remplacez simplement :
- `<FIREBASE_DATABASE_URL>` par l'URL de votre base.
- `<NODE>` par le chemin/nœud où sauvegarder les données.
- `<DATA>` par les données à enregistrer.

---

