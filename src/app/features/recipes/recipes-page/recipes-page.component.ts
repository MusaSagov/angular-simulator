import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectError, selectLoading, selectRecipes } from '../store/recipes.selectors';
import { loadRecipes } from '../store/recipes.actions';
import { Observable } from 'rxjs';
import { IRecipe } from '../interfaces/IRecipe';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-recipes-page',
  imports: [AsyncPipe],
  templateUrl: './recipes-page.component.html',
  styleUrl: './recipes-page.component.scss',
})
export class RecipesPageComponent implements OnInit {

    private store: Store<any> = inject(Store);
    recipes$: Observable<IRecipe[]> = this.store.select(selectRecipes);
    loading$: Observable<boolean> = this.store.select(selectLoading);
    error$: Observable<string | null> = this.store.select(selectError);

    ngOnInit(): void {
      this.reloadRecipes();
    }

    reloadRecipes(): void {
      this.store.dispatch(loadRecipes());
    }

}
