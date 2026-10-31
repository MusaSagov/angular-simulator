import { createAction, props } from "@ngrx/store";
import { IRecipe } from "../interfaces/IRecipe";


export const loadRecipes = createAction(
  '[Recipes] Load Recipes'
);

export const loadRecipesSuccess = createAction(
  '[Recipes] Load Recipes Success',
  props<{ recipes:IRecipe[] }>()
);

export const loadRecipesFailure = createAction(
  '[Recipes] Load Recipes Failure',
  props<{ error: string}>()
);