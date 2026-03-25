import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import {ProductService} from "../../../../services/product.service";

@Component({
  selector: 'app-latest-product-section',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './latest-product-section.component.html',
  styleUrl: './latest-product-section.component.scss'
})
export class LatestProductSectionComponent implements OnInit {
  latestProducts: any[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadLatestProducts();
  }

  loadLatestProducts(): void {
    this.productService.findAllProducts().subscribe({
      next: (response) => {
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
          // Sort by ID or timestamp if available, here we just take the last 4 for "latest"
          this.latestProducts = result.slice(-4).reverse();
        }
      },
      error: (err) => console.error('Error loading latest products:', err)
    });
  }

  trackById(index: number, item: any): string {
    return item.id || item._id || index;
  }
}
