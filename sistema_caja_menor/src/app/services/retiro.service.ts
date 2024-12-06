import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Retiro } from '../models/Retiro';

@Injectable({
  providedIn: 'root'
})

export class RetiroService {
  private url = `http://localhost:8080/sistema-caja-menor/api-system/retiros`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json'
    })
  }

  create(retiro: Retiro): Observable<any> {
    const formattedJson = JSON.stringify(retiro, null, 2);
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.url, formattedJson, { headers });
  }

  getByIdRetiranteOrFecha(filter: string | null): Observable<Retiro[]> {
    let params = new HttpParams();
    if (filter && filter.includes("-")) {
      params = params.set('fecha', filter);
    } else if (filter) {
      params = params.set('id-retirante', filter);
    }
    const headers = this.getAuthHeaders();
    return this.http.get<Retiro[]>(this.url, { params: params.keys().length ? params : undefined, headers });
  }


  deleteByIdRecepcionista(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(this.url, { headers });
  }
}


