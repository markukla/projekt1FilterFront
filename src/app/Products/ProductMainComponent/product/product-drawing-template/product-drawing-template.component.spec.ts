import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDrawingTemplateComponent } from './product-drawing-template.component';

describe('CreateProductDrawingFormForUserComponent', () => {
  let component: ProductDrawingTemplateComponent;
  let fixture: ComponentFixture<ProductDrawingTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDrawingTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDrawingTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
