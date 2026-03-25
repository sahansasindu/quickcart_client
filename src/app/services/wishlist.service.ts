import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { CookieManagerService } from './cookie-manager.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = new BehaviorSubject<any[]>([]);
  wishlist$ = this.wishlistItems.asObservable();

  private baseUrl = environment.baseUrl + 'product-service-api/api/v1/bookmark';

  constructor(
    private http: HttpClient,
    private cookieManager: CookieManagerService,
    private router: Router
  ) {
    this.loadWishlist();
  }

  private getHeaders(): HttpHeaders {
    const token = this.cookieManager.getToken('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  public loadWishlist(): void {
    if (this.cookieManager.tokenIsExists('access_token')) {
      this.findAllBookmark().subscribe(res => {
        if (res && res.data && res.data.list) {
          // Decode token to find current user
          const token = this.cookieManager.getToken('access_token');
          let currentUserId = null;
          try {
            if (token) {
              const base64Url = token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
              const decoded = JSON.parse(jsonPayload);
              currentUserId = decoded.sub || decoded.userId;
            }
          } catch (e) { }

          // The backend stores the item in `productId` property, but we use it as the whole product in UI
          const fetchedBookmarks = res.data.list
            .filter((item: any) => !currentUserId || item.userId === currentUserId)
            .map((item: any) => {
              const product = item.productId || {};
              // attach bookmark ID so we can delete it later
              product.bookmarkId = item._id;
              return product;
            });
          this.wishlistItems.next(fetchedBookmarks);
        }
      }, err => {
        console.error("Failed to load wishlist", err);
      });
    } else {
      // Fallback to local storage if not logged in? (Or just keep empty, matching actual business logic)
      const saved = localStorage.getItem('quickcart_wishlist');
      if (saved) {
        this.wishlistItems.next(JSON.parse(saved));
      }
    }
  }

  private saveLocalWishlist(items: any[]): void {
    if (!this.cookieManager.tokenIsExists('access_token')) {
      localStorage.setItem('quickcart_wishlist', JSON.stringify(items));
      this.wishlistItems.next(items);
    }
  }

  toggleWishlist(product: any): void {
    if (!this.cookieManager.tokenIsExists('access_token')) {
      this.router.navigate(['/security/context/login']);
      return;
    }

    const current = this.wishlistItems.value;
    const productId = product.id || product._id || (product._id?.$oid);

    // Check if it exists in current local state
    const existingIndex = current.findIndex(p => {
      const id = p.id || p._id || (p._id?.$oid);
      return id === productId;
    });

    if (existingIndex > -1) {
      const existingItem = current[existingIndex];
      // Optimistic remove
      current.splice(existingIndex, 1);
      this.wishlistItems.next([...current]);

      if (existingItem.bookmarkId) {
        this.deleteBookmark(existingItem.bookmarkId).subscribe(
          () => {},
          err => {
            console.error("Failed to remove bookmark", err);
            // Rollback
            current.splice(existingIndex, 0, existingItem);
            this.wishlistItems.next([...current]);
          }
        );
      }
    } else {
      // Optimistic add
      this.wishlistItems.next([...current, product]);

      this.createBookmark({
        productId: product,
        createDate: new Date()
      }).subscribe(res => {
        if (res && res.data) {
          // update the bookmarkId in our local state
          const updated = this.wishlistItems.value.map(p => {
            if ((p.id || p._id || (p._id?.$oid)) === productId) {
              p.bookmarkId = res.data._id;
            }
            return p;
          });
          this.wishlistItems.next(updated);
        }
      }, err => {
        console.error("Failed to add bookmark", err);
        // Rollback
        this.wishlistItems.next(this.wishlistItems.value.filter(p => (p.id || p._id || (p._id?.$oid)) !== productId));
      });
    }
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItems.value.some(p => {
      const id = p.id || p._id || (p._id?.$oid);
      return id === productId;
    });
  }

  getWishlistCount(): number {
    return this.wishlistItems.value.length;
  }

  // ==== Backend API Integrations ====

  createBookmark(bookmarkData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-bookmark`, bookmarkData, { headers: this.getHeaders() });
  }

  deleteBookmark(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-bookmark/${id}`, { headers: this.getHeaders() });
  }

  findBookmarkById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/find-bookmark-by-id/${id}`, { headers: this.getHeaders() });
  }

  findAllBookmark(page: number = 1, size: number = 100): Observable<any> {
    // Passing pagination query params
    return this.http.get(`${this.baseUrl}/find-all-bookmark?page=${page}&size=${size}`, { headers: this.getHeaders() });
  }
}
