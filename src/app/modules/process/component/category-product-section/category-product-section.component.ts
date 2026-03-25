import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import {ProductService} from "../../../../services/product.service";

@Component({
  selector: 'app-category-product-section',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './category-product-section.component.html',
  styleUrl: './category-product-section.component.scss'
})
export class CategoryProductSectionComponent {

  products: any[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.findAllProducts().subscribe({
      next: (response) => {
        const findFirstArray = (obj: any): any[] => {
          if (Array.isArray(obj)) return obj;
          if (obj && typeof obj === 'object') {
            for (const key in obj) {
              const res = findFirstArray(obj[key]);
              if (res.length > 0) return res;
            }
          }
          return [];
        };
        this.products = findFirstArray(response).slice(0, 6);
      }
    });
  }
}
