import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/Producto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private url = `http://localhost:8080/sistema-caja-menor/api-system/productos`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json'
    })
  }

  create(producto: Producto): Observable<any> {
    const formattedJson = JSON.stringify(producto, null, 2);
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.url, formattedJson, { headers });
  }

  getByIdOrNombre(filter: string | null): Observable<Producto[]> {
    let params = new HttpParams();
    if (filter && /\d/.test(filter)) {
      params = params.set('cedula', filter);
    } else if (filter) {
      params = params.set('nombre', filter);
    }
    const headers = this.getAuthHeaders();
    return this.http.get<Producto[]>(this.url, { params, headers });
  }

  deleteById(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(this.url, { params, headers });
  }

  update(producto: Producto): Observable<any> {
    const headers = this.getAuthHeaders();
    const formattedJson = JSON.stringify(producto, null, 2);
    return this.http.put<any>(this.url, formattedJson, { headers });
  }
}
