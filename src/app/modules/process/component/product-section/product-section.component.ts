import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import {ProductService} from "../../../../services/product.service";

@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-section.component.html',
  styleUrl: './product-section.component.scss'
})
export class ProductSectionComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.findAllProducts().subscribe({
      next: (response) => {
        console.log('Products API Response:', response);

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
          this.products = result;
        } else {
          this.products = [];
        }

        console.log('Processed Products:', this.products);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.products = [];
      }
    });
  }

  trackById(index: number, item: any): string {
    return item.id || item._id || index;
  }
}
