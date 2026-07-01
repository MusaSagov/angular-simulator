import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { IAuthLoginRequest, ILogin, IToken, IAuthUser} from './interfaces/index';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = 'https://dummyjson.com';

  private userSubject = new BehaviorSubject<IAuthUser | null>(null);
  user$ = this.userSubject.asObservable();

  login(data: IAuthLoginRequest): Observable<ILogin> {
    return this.http.post<ILogin>
    (`${ this.apiUrl }/auth/login`, data, {
       withCredentials: true }
    ).pipe(
      tap((res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        this.userSubject.next(res);
      })
    );
  }

  initAuth(): Observable<boolean> {
    const token = this.getAccessToken();

    if (!token) {
      this.userSubject.next(null);
      return of(false);
    }

    return this.http.get<IAuthUser>(`${ this.apiUrl }/auth/me`, {
      headers: {Authorization: `Bearer ${ token }`,}, withCredentials: true,})
      .pipe(
        tap((user) => this.userSubject.next(user)),
        map(() => true),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  refreshToken(): Observable<IToken> {
    const refreshToken = this.getRefreshToken();

    return this.http.post<IToken>(
      `${ this.apiUrl }/auth/refresh`,
      refreshToken ? { refreshToken } : {},
      { withCredentials: true })
      .pipe(
        tap((res) => {
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.userSubject.next(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
  
}