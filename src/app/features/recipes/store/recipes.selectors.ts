import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { IRecipesState } from './recipes.reducer';

export const selectRecipesState =
  createFeatureSelector<IRecipesState>('recipes');

export const selectRecipes = createSelector(
  selectRecipesState,
  (state) => state.recipes
);

export const selectLoading = createSelector(
  selectRecipesState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectRecipesState,
  (state) => state.error
);