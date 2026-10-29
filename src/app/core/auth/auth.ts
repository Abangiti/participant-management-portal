import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginRequest {
  username: string;
  password: string;
  grant_type: string;
  client_id: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  scope: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:9081/api/v1/auth/login';

  login(username: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = {
      username,
      password,
      grant_type: 'password',
      client_id: 'acs_apis_client_api'
    };

    return this.http.post<LoginResponse>(this.apiUrl, body).pipe(
      tap((response) => {
        if (response.access_token) {
          sessionStorage.setItem('accessToken', response.access_token);
          sessionStorage.setItem('isLoggedIn', 'true');
        }
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('isLoggedIn');
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('accessToken');
  }
}
