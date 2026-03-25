import { Component } from '@angular/core';
import { ProductSectionComponent } from '../product-section/product-section.component';
import { CategoryProductSectionComponent } from '../category-product-section/category-product-section.component';
import { LatestProductSectionComponent } from '../latest-product-section/latest-product-section.component';


@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    ProductSectionComponent,
    CategoryProductSectionComponent,
    LatestProductSectionComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

}
