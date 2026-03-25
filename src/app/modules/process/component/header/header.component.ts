import { Component,OnInit } from '@angular/core';
import {RouterLink} from "@angular/router";
import {CategoryService} from "../../../../services/category.service";
import {WishlistService} from "../../../../services/wishlist.service";
import { CartService } from '../../../../services/cart.service';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  categories: any[] = [];
  isLoggedIn = false;
  isSidebarOpen = false;

  constructor(
    private categoryService: CategoryService,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) { }

  getWishlistCount(): number {
    return this.wishlistService.getWishlistCount();
  }

  getCartCount(): number {
    return this.cartService.getCartCount();
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.findAllCategories().subscribe({
      next: (response: any) => {
        console.log('Categories API Response:', response);

        const findFirstArray = (obj: any): any[] | null => {
          if (Array.isArray(obj)) return obj;
          if (obj && typeof obj === 'object') {
            for (const key in obj) {
              const res = findFirstArray(obj[key]);
              if (res) return res;
            }
          }
          return null;
        };

        const result = findFirstArray(response);
        if (result) {
          this.categories = result;
        } else {
          this.categories = [];
        }

        console.log('Processed Categories:', this.categories);
      },
      error: (err: any) => {
        console.error('Error fetching categories:', err);
        this.categories = [];
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  trackById(index: number, item: any): string {
    return item.id || index;
  }
}
