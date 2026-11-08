import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IQuotesResponse } from "./interfaces/IQuotesResponse";


@Injectable({
  providedIn: 'root',
})
export class QuotesApiService {

  private apiUrl: string = 'https://dummyjson.com/quotes';
  private http: HttpClient = inject(HttpClient);

  getQuotes(): Observable<IQuotesResponse> {
    return this.http.get<IQuotesResponse>(this.apiUrl)
  }

}