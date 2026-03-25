import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enveronment.service';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = environment.baseUrl + 'product-service-api/api/v1/categories';

  constructor(private http: HttpClient) { }

  findAllCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/find-all-categories`);
  }

  findCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/find-category-by-id/${id}`);
  }
}
