import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../../../services/product.service";
import {environment} from "../../../../../enviroments/enveronment.service";
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductReviewComponent } from '../product-review/product-review.component';

@Component({
  selector: 'app-product-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductReviewComponent],
  templateUrl: './product-overview.component.html',
  styleUrl: './product-overview.component.scss'
})
export class ProductOverviewComponent implements OnInit {
  product: any;
  selectedQty: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  loadProduct(id: string): void {
    this.productService.findProductById(id).subscribe({
      next: (response) => {
        console.log('Product Overview data:', response);
        // Using the same findFirstArray logic for consistency
        const findFirstObject = (obj: any): any | null => {
          if (obj && typeof obj === 'object') {
            if (obj.productName) return obj; // Found the product object
            for (const key in obj) {
              const res = findFirstObject(obj[key]);
              if (res) return res;
            }
          }
          return null;
        };
        this.product = findFirstObject(response);
      },
      error: (err) => console.error('Error loading product details:', err)
    });
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
    return 'https://via.placeholder.com/500';
  }

  getDisplayDiscount(discount: any): string {
    if (typeof discount === 'number') return discount.toString();
    if (typeof discount === 'string') return discount;
    if (typeof discount === 'object') return discount.amount || discount.value || discount.percentage || '0';
    return '0';
  }
}

