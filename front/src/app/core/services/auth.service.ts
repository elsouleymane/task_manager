// src/app/core/services/auth.service.ts
      import { Injectable } from '@angular/core';
      import { HttpClient } from '@angular/common/http';
      import { BehaviorSubject, Observable, tap } from 'rxjs';
      import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
      import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'jwt';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/token/`, credentials)
      .pipe(
        tap(response => {
          console.log('Full response:', response);
          if (response.access) {
            console.log('Access token received:', response.access);

            localStorage.setItem(this.tokenKey, response.access);
            this.isLoggedInSubject.next(true);
          } else {
            console.error('No token in response:', response);
          }
        })
      );
  }

  register(user: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register/`, user);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('Token retrieved:', token);
    return token;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
