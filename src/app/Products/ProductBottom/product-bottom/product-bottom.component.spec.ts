import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBottomComponent } from './product-bottom.component';

describe('ProductBottomComponent', () => {
  let component: ProductBottomComponent;
  let fixture: ComponentFixture<ProductBottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBottomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
