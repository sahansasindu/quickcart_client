import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {environment} from "../../../../../enviroments/enveronment.service";
import {Router, RouterLink} from "@angular/router";
import {WishlistService} from "../../../../services/wishlist.service";
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product: any;

  constructor(
    private router: Router,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) { }

  isBookmarked(): boolean {
    return this.wishlistService.isInWishlist(this.getProductId());
  }

  toggleBookmark(event: MouseEvent): void {
    event.stopPropagation();
    this.wishlistService.toggleWishlist(this.product);
  }

  getProductId(): string {
    const p = this.product;
    const id = p?.id || p?._id || (p?._id && typeof p._id === 'object' ? p._id.$oid : '') || '';
    return id;
  }

  onCardClick(event: MouseEvent): void {
    // Navigation is handled by routerLink on h3, but this makes the whole card clickable as well
    const target = event.target as HTMLElement;
    if (!target.closest('button') && !target.closest('a')) {
      const id = this.getProductId();
      if (id) {
        this.router.navigate(['/process/context/product-overview', id]);
      }
    }
  }

  handleAddToCart(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addToCart(this.product);
    console.log('Added to cart:', this.product.productName);
  }

  getImageUrl(images: any): string {
    if (Array.isArray(images) && images.length > 0) {
      const img = images[0];
      let url = '';
      if (typeof img === 'string') url = img;
      else if (typeof img === 'object') url = img.url || img.imageUrl || '';

      if (url) {
        if (!url.startsWith('http') && !url.startsWith('data:')) {
          const baseUrl = environment.baseUrl.endsWith('/') ? environment.baseUrl : environment.baseUrl + '/';
          const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
          return baseUrl + cleanUrl;
        }
        return url;
      }
    }
    return 'https://via.placeholder.com/200';
  }

  getDisplayDiscount(discount: any): string {
    if (typeof discount === 'number') return discount.toString();
    if (typeof discount === 'string') return discount;
    if (typeof discount === 'object') return discount.amount || discount.value || discount.percentage || '0';
    return '0';
  }
}
