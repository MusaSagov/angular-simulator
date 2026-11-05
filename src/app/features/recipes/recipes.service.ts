import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IRecipe } from "./interfaces/IRecipe";
import { Observable } from "rxjs";
import { IRecipesResponse } from "./interfaces/IRecipesResponse";


@Injectable({
  providedIn: 'root',
})
export class RecipesService {

  private apiUrl: string = 'https://dummyjson.com/recipes';
  private http: HttpClient = inject(HttpClient);

  getRecipes(): Observable<IRecipesResponse> {
    return this.http.get<IRecipesResponse>(this.apiUrl)
  }

}