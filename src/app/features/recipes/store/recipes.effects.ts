
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, Observable, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RecipesService } from '../recipes.service';
import { IRecipe } from '../interfaces/IRecipe';

import {
  loadRecipes,
  loadRecipesFailure,
  loadRecipesSuccess,
} from './recipes.actions';
import { Action } from '@ngrx/store';
import { IRecipesResponse } from '../interfaces/IRecipesResponse';

@Injectable()
export class RecipesEffects {
  private actions$: Actions= inject(Actions);
  private recipesService: RecipesService = inject(RecipesService);

  loadRecipes$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRecipes),

      exhaustMap(() =>
        this.recipesService.getRecipes().pipe(
          map((response: IRecipesResponse ) =>
            loadRecipesSuccess({  recipes: response.recipes  })
          ),

          catchError((error: HttpErrorResponse) =>
            of(loadRecipesFailure({ error: error.message }))
          )
        )
      )
    )
  );

}
