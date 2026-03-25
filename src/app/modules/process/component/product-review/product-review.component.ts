import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ReviewService} from "../../../../services/review.service";
import {CookieManagerService} from "../../../../services/cookie-manager.service";

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.scss'
})
export class ProductReviewComponent implements OnInit {
  @Input() productId!: string;

  isLoggedIn = false;
  currentUserId: string | null = null;
  displayName: string = '';

  allReviews: any[] = [];
  filteredReviews: any[] = [];
  isLoading = true;

  formRating = 0;
  hoveredRating = 0;
  formMessage = '';
  editingReviewId: string | null = null;

  constructor(
    private reviewService: ReviewService,
    private cookieManager: CookieManagerService
  ) {}

  ngOnInit(): void {
    this.extractUserFromToken();
    this.loadReviews();
  }

  extractUserFromToken() {
    this.isLoggedIn = this.cookieManager.tokenIsExists('access_token');
    if (this.isLoggedIn) {
      const token = this.cookieManager.getToken('access_token');
      try {
        if (token) {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
          const decoded = JSON.parse(jsonPayload);
          this.currentUserId = decoded.sub || decoded.userId;
          this.displayName = decoded.name || decoded.preferred_username || "Unknown User";
        }
      } catch (e) {
        console.error("Token decoding failed", e);
      }
    }
  }

  loadReviews() {
    this.isLoading = true;
    // We request a large number of reviews since backend doesn't filter by product
    this.reviewService.findAllReview(1, 1000).subscribe({
      next: (res) => {
        if (res && res.data && res.data.list) {
          this.allReviews = res.data.list;
          this.filterReviewsForProduct();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load reviews', err);
        this.isLoading = false;
      }
    });
  }

  filterReviewsForProduct() {
    if (!this.productId) return;
    this.filteredReviews = this.allReviews.filter((r: any) => {
      const revProductId = r.productId?.id || r.productId?._id || r.productId?.$oid || r.productId;
      const thisProductId = this.productId;
      return revProductId === thisProductId;
    });
    // Sort by descending created Date
    this.filteredReviews.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  }

  setRating(rating: number) { this.formRating = rating; }
  hoverRating(rating: number) { this.hoveredRating = rating; }

  submitReview() {
    if (!this.formMessage || !this.formRating) return;

    const payload = {
      orderId: 'N/A', // Assuming no strict order validation for now
      message: this.formMessage,
      createdDate: new Date(),
      userId: this.currentUserId,
      displayName: this.displayName,
      productId: this.productId,
      rating: this.formRating
    };

    this.reviewService.createReview(payload).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.allReviews.push(res.data);
          this.filterReviewsForProduct();
          this.resetForm();
        }
      },
      error: (err) => console.error('Failed to submit review', err)
    });
  }

  startEdit(review: any) {
    this.editingReviewId = review._id;
    this.formMessage = review.message;
    this.formRating = review.rating;

    // Scroll to form slightly
    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
  }

  cancelEdit() {
    this.resetForm();
  }

  updateReview() {
    if (!this.editingReviewId) return;

    const payload = {
      message: this.formMessage,
      rating: this.formRating
    };

    this.reviewService.updateReview(this.editingReviewId, payload).subscribe({
      next: (res) => {
        if (res && res.data) {
          const index = this.allReviews.findIndex(r => r._id === this.editingReviewId);
          if (index !== -1) {
            // Merge updated data
            this.allReviews[index] = { ...this.allReviews[index], ...res.data };
            this.filterReviewsForProduct();
          }
          this.resetForm();
        }
      },
      error: (err) => console.error('Failed to update review', err)
    });
  }

  deleteReview(id: string) {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(id).subscribe({
        next: () => {
          this.allReviews = this.allReviews.filter(r => r._id !== id);
          this.filterReviewsForProduct();
        },
        error: (err) => console.error('Failed to delete review', err)
      });
    }
  }

  resetForm() {
    this.formMessage = '';
    this.formRating = 0;
    this.editingReviewId = null;
  }
}

