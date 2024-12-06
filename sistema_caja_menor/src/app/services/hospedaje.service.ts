import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Hospedaje } from '../models/Hospedaje';

@Injectable({
  providedIn: 'root'
})

export class HospedajeService {
  private url = `http://localhost:8080/sistema-caja-menor/api-system/hospedajes`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json'
    })
  }

  create(hospedaje: Hospedaje): Observable<any> {
    const formattedJson = JSON.stringify(hospedaje, null, 2);
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.url, formattedJson, { headers });
  }

  getByIdHuesped(filter: string | null): Observable<Hospedaje[]> {
    let params = new HttpParams();
    if (filter !== null) {
      params = params.set('id-huesped', filter);
    }
    const headers = this.getAuthHeaders();
    return this.http.get<Hospedaje[]>(this.url, { params, headers });
  }

  deleteById(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(this.url, { params, headers });
  }

  update(hospedaje: Hospedaje): Observable<any> {
    const headers = this.getAuthHeaders();
    const formattedJson = JSON.stringify(hospedaje, null, 2);
    return this.http.put<any>(this.url, formattedJson, { headers });
  }
}

