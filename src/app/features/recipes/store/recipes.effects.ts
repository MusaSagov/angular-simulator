
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { RecipesService } from '../recipes.service';

import {
  loadRecipes,
  loadRecipesFailure,
  loadRecipesSuccess,
} from './recipes.actions';

@Injectable()
export class RecipesEffects {
  private actions$ = inject(Actions);
  private recipesService: RecipesService = inject(RecipesService);

  loadRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRecipes),

      switchMap(() =>
        this.recipesService.getRecipes().pipe(
          map((response) =>
            loadRecipesSuccess({ recipes: response.recipes })
          ),

          catchError((error) =>
            of(loadRecipesFailure({ error: error.message }))
          )
        )
      )
    )
  );

}
