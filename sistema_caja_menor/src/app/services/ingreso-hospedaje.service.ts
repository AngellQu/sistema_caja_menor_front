import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { IngresoHospedaje } from '../models/IngresoHospedaje';

@Injectable({
  providedIn: 'root'
})
export class IngresoHospedajeService {
  private url = `http://localhost:8080/sistema-caja-menor/api-system/ingresos-hospedajes`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json'
    })
  }

  create(ingresoHospedaje: IngresoHospedaje): Observable<any> {
    const formattedJson = JSON.stringify(ingresoHospedaje, null, 2);
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.url, formattedJson, { headers });
  }

  getByIdHospedaje(filter: string | null): Observable<IngresoHospedaje[]> {
    let params = new HttpParams();
    if (filter && filter.includes("-")) {
      params = params.set('fecha', filter);
    } else if (filter) {
      params = params.set('id-hospedaje', filter);
    }
    const headers = this.getAuthHeaders();
    return this.http.get<IngresoHospedaje[]>(this.url, { params: params.keys().length ? params : undefined, headers });
  }

  deleteByIdRecepcionista(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(this.url, { headers });
  }
}


