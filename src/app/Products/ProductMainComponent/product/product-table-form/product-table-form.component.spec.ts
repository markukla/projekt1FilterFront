import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTableFormComponent } from './product-table-form.component';

describe('ProductTableFormComponent', () => {
  let component: ProductTableFormComponent;
  let fixture: ComponentFixture<ProductTableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTableFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
