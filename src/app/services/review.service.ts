import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CookieManagerService } from './cookie-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  // Assuming review service is hosted on product-service-api or review-service-api.
  // Using product-service-api to match the node service routing
  private baseUrl = environment.baseUrl + 'product-service-api/api/v1/review';

  constructor(
    private http: HttpClient,
    private cookieManager: CookieManagerService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.cookieManager.getToken('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createReview(reviewData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-review`, reviewData, { headers: this.getHeaders() });
  }

  updateReview(id: string, reviewData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-review/${id}`, reviewData, { headers: this.getHeaders() });
  }

  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-review/${id}`, { headers: this.getHeaders() });
  }

  findReviewById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/find-review-by-id/${id}`, { headers: this.getHeaders() });
  }

  findAllReview(page: number = 1, size: number = 100): Observable<any> {
    return this.http.get(`${this.baseUrl}/find-all-review?page=${page}&size=${size}`, { headers: this.getHeaders() });
  }
}
