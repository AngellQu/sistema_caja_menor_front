import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  private readonly USERNAME_KEY = 'username';
  private url = `http://localhost:8080/sistema-caja-menor/api-system/credentials`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  saveToken(token: string): void {
    this.tokenService.setToken(token);
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  clearToken(): void {
    this.tokenService.clearToken();
  }

  saveName(name: string): void {
    localStorage.setItem(this.USERNAME_KEY, name);
  }

  getName(): string {
    return localStorage.getItem(this.USERNAME_KEY) || '';
  }

  logIn(username: string, password: string): Observable<{ token: string }> {
    const credentials = { cedula: username, contrasenia: password };
    const formattedCredentials = JSON.stringify(credentials, null, 2);
    return this.http.post<any>(this.url, formattedCredentials).pipe(
      map((response) => {
        this.saveName(response[0]?.nombre);
        this.saveToken(response[1]?.token);
        return response;
      }),
      catchError((error) => {
        return throwError(() => new Error(error.error));
      })
    );
  }

  logOut(): Observable<any> {
    const token = this.getToken();
    const headers = { 'Authorization': `${token}` };

    return this.http.delete<any>(this.url, { headers }).pipe(
      map((response) => {
        this.clearToken();
        return response;
      }),
      catchError((error) => {
        return throwError(() => new Error(error.error));
      })
    );
  }
}
