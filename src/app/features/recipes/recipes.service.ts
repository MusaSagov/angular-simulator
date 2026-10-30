import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IRecipe } from "./interfaces/IRecipe";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class RecipesService {

  private apiUrl: string = 'https://dummyjson.com/recipes';
  private http: HttpClient = inject(HttpClient);

  getRecipes(): Observable<{ recipes: IRecipe[] }> {
    return this.http.get<{ recipes: IRecipe[] }>(this.apiUrl)
  }

}