import {Component, OnInit} from '@angular/core';
import { CartService, CartItem } from '../../../../services/cart.service';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  updateQty(item: CartItem, delta: number): void {
    const productId = item.product.id || item.product._id || (item.product._id?.$oid);
    this.cartService.updateQuantity(productId, item.quantity + delta);
  }

  removeItem(item: CartItem): void {
    const productId = item.product.id || item.product._id || (item.product._id?.$oid);
    this.cartService.removeFromCart(productId);
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  getCartCount(): number {
    return this.cartService.getCartCount();
  }

  getImageUrl(product: any): string {
    const images = product.images;
    if (Array.isArray(images) && images.length > 0) {
      const img = images[0];
      let url = typeof img === 'string' ? img : (img.url || img.imageUrl || '');
      if (url && !url.startsWith('http')) {
        return 'http://localhost:3000/' + url; // Simple fallback, should use environment
      }
      return url;
    }
    return 'https://via.placeholder.com/150';
  }
}
