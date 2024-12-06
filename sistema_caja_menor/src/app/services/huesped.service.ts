import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Huesped } from '../models/Huesped';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class HuespedService {
  private url = `http://localhost:8080/sistema-caja-menor/api-system/huespedes`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  private getAuthHeaders(): HttpHeaders{
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type' : 'application/json'
    })
  }

  create(huesped: Huesped): Observable<any> {
    const formattedJson = JSON.stringify(huesped, null, 2);
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.url, formattedJson, { headers });
  }

  getByCedulaOrName(filter: string | null): Observable<Huesped[]> {
    let params = new HttpParams();
    if (filter && /\d/.test(filter)) {
      params = params.set('cedula', filter);
    } else if (filter) {
      params = params.set('nombre', filter);
    }
    const headers = this.getAuthHeaders();
    return this.http.get<Huesped[]>(this.url, { params, headers });
  }
  
  deleteByCedula(cedula: string): Observable<any>{
    const params = new HttpParams().set('cedula', cedula);
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(this.url, {params, headers});
  }

  update(huesped: Huesped): Observable<any>{
    const headers = this.getAuthHeaders();
    const formattedJson = JSON.stringify(huesped, null, 2);
    return this.http.put<any>(this.url, formattedJson, { headers });
  }
}
