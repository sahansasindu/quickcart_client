import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = environment.baseUrl + 'product-service-api/api/v1/product';

  constructor(private http: HttpClient) { }

  findAllProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/find-all-product`);
  }

  findProductById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/find-product-by-id/${id}`);
  }
}
