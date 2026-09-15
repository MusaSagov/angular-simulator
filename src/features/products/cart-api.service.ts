import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICartApi } from './interfaces/ICartApi';
import { ICartAddPayload } from './interfaces/ICartAddPayload';
import { ICartUpdatePayload } from './interfaces/ICartUpdatePayload';

@Injectable({ providedIn: 'root' })
export class CartApiService {
  
  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = 'https://dummyjson.com';

  getCart(cartId: number): Observable<ICartApi> {
    return this.http.get<ICartApi>(`${this.baseUrl}/carts/${cartId}`);
  }

  addCart(payload: ICartAddPayload): Observable<ICartApi> {
    return this.http.post<ICartApi>(`${this.baseUrl}/carts/add`, payload);
  }

  updateCart(cartId: number, payload: ICartUpdatePayload): Observable<ICartApi> {
    return this.http.put<ICartApi>(`${this.baseUrl}/carts/${cartId}`, payload);
  }

  deleteCart(cartId: number): Observable<ICartApi> {
    return this.http.delete<ICartApi>(`${this.baseUrl}/carts/${cartId}`);
  }

}