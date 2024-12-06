import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Retirante } from '../models/Retirante';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})

export class RetiranteService {
  private url = `http://localhost:8080/sistema-caja-menor/api-system/retirantes`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json'
    })
  }

  create(retirante: Retirante): Observable<any> {
    const formattedJson = JSON.stringify(retirante, null, 2);
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.url, formattedJson, { headers });
  }

  getByIdOrNombre(filter: string | null): Observable<Retirante[]> {
    let params = new HttpParams();
    if (filter && /\d/.test(filter)) {
      params = params.set('cedula', filter);
    } else if (filter) {
      params = params.set('nombre', filter);
    }
    const headers = this.getAuthHeaders();
    return this.http.get<Retirante[]>(this.url, { params, headers });
  }

  deleteById(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(this.url, { params, headers });
  }

  update(retirante: Retirante): Observable<any> {
    const headers = this.getAuthHeaders();
    const formattedJson = JSON.stringify(retirante, null, 2);
    return this.http.put<any>(this.url, formattedJson, { headers });
  }
}


