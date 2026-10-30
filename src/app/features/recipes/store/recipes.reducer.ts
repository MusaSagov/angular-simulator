import { IRecipe } from '../interfaces/IRecipe';
import { createReducer, on } from '@ngrx/store';
import { loadRecipes, loadRecipesFailure, loadRecipesSuccess } from './recipes.actions';

export interface IRecipesState {
  recipes: IRecipe[];
  loading: boolean;
  error: string | null;
}

export const initialState: IRecipesState = {
  recipes: [],
  loading: false,
  error: null,
};

export const recipesReducer = createReducer(
  initialState,

  on(loadRecipes, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(loadRecipesSuccess, (state, { recipes }) => ({
    ...state,
    recipes,
    loading: false,
    error:null,
  })),

  on(loadRecipesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);