import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductDrawingComponent } from './create-product-drawing.component';

describe('CreateProductDrawingComponent', () => {
  let component: CreateProductDrawingComponent;
  let fixture: ComponentFixture<CreateProductDrawingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProductDrawingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
