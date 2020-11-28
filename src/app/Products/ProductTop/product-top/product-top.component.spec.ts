import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTopComponent } from './product-top.component';

describe('ProductTopComponent', () => {
  let component: ProductTopComponent;
  let fixture: ComponentFixture<ProductTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
