import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestProductSectionComponent } from './latest-product-section.component';

describe('LatestProductSectionComponent', () => {
  let component: LatestProductSectionComponent;
  let fixture: ComponentFixture<LatestProductSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestProductSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LatestProductSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
