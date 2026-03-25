import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryProductSectionComponent } from './category-product-section.component';

describe('CategoryProductSectionComponent', () => {
  let component: CategoryProductSectionComponent;
  let fixture: ComponentFixture<CategoryProductSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryProductSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryProductSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
