import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {WishlistService} from "../../../../services/wishlist.service";
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {
  products: any[] = [];

  constructor(private wishlistService: WishlistService) { }

  ngOnInit(): void {
    this.wishlistService.wishlist$.subscribe(items => {
      this.products = items;
    });
  }

  removeItem(product: any): void {
    // Calling toggleWishlist will remove it since it's already in the wishlist.
    this.wishlistService.toggleWishlist(product);
  }
}
