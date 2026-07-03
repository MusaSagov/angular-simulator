import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { IToken, IAuthUser, IAuthResponse, ILogin} from './interfaces/index';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http: HttpClient = inject(HttpClient);
  private apiUrl: string = 'https://dummyjson.com';

  private userSubject: BehaviorSubject<IAuthUser | null> = new BehaviorSubject<IAuthUser | null>(null);
  user$: Observable<IAuthUser | null> = this.userSubject.asObservable();

  login(data: ILogin): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>
    (`${ this.apiUrl }/auth/login`, data, {
       withCredentials: true }
    ).pipe(
      tap((res: IAuthResponse) => {
        const tokens: IToken = {
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        };
        this.saveTokens(tokens);
      })
    );
  }

  initAuth(): Observable<boolean> {
    const token: string | null = this.getAccessToken();

    if (!token) {
      this.userSubject.next(null);
      return of(false);
    }

    return this.http.get<IAuthUser>(`${ this.apiUrl }/auth/me`, {
      headers: {Authorization: `Bearer ${ token }`,}, withCredentials: true,})
      .pipe(
        tap((user: IAuthUser) => this.userSubject.next(user)),
        map(() => true),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  refreshToken(): Observable<IToken> {
    const currentTokens: IToken | null = this.getTokens();
    const refreshToken: string | null = currentTokens?.refreshToken ?? null;

    return this.http.post<IToken>(
      `${ this.apiUrl }/auth/refresh`,
      refreshToken ? { refreshToken } : {},
      { withCredentials: true })
      .pipe(
        tap((res: IToken) => {
          const tokens: IToken = {
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          };
        this.saveTokens(tokens);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('tokens');
    this.userSubject.next(null);
  }

  getAccessToken(): string | null {
    const tokens: IToken | null = this.getTokens();
    return tokens?.accessToken ?? null;
  }

  getRefreshToken(): string | null {
    const tokens: IToken | null = this.getTokens();
    return tokens?.refreshToken ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  private saveTokens(tokens: IToken): void {
    localStorage.setItem('tokens', JSON.stringify(tokens));
  }

  private getTokens(): IToken | null {
    const raw: string | null = localStorage.getItem('tokens');
    return raw ? JSON.parse(raw) as IToken : null;
  }

}