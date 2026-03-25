import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNotFoundPageComponent } from './app-not-found-page.component';

describe('AppNotFoundPageComponent', () => {
  let component: AppNotFoundPageComponent;
  let fixture: ComponentFixture<AppNotFoundPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppNotFoundPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppNotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
