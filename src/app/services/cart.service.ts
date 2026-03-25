import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  product: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartItems.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const saved = localStorage.getItem('quickcart_cart');
    if (saved) {
      this.cartItems.next(JSON.parse(saved));
    }
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('quickcart_cart', JSON.stringify(items));
    this.cartItems.next(items);
  }

  addToCart(product: any, quantity: number = 1): void {
    const current = this.cartItems.value;
    const productId = product.id || product._id || (product._id?.$oid);
    const existing = current.find(item => {
      const id = item.product.id || item.product._id || (item.product._id?.$oid);
      return id === productId;
    });

    if (existing) {
      existing.quantity += quantity;
      this.saveCart([...current]);
    } else {
      this.saveCart([...current, { product, quantity }]);
    }
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const updated = this.cartItems.value.map(item => {
      const id = item.product.id || item.product._id || (item.product._id?.$oid);
      if (id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.saveCart(updated);
  }

  removeFromCart(productId: string): void {
    const updated = this.cartItems.value.filter(item => {
      const id = item.product.id || item.product._id || (item.product._id?.$oid);
      return id !== productId;
    });
    this.saveCart(updated);
  }

  getTotalPrice(): number {
    return this.cartItems.value.reduce((total, item) => {
      return total + (item.product.actualPrice * item.quantity);
    }, 0);
  }

  getCartCount(): number {
    return this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
  }

  reloadCart(): void {
    this.loadCart();
  }
}
