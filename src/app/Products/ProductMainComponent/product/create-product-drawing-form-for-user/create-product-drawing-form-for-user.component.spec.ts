import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductDrawingFormForUserComponent } from './create-product-drawing-form-for-user.component';

describe('CreateProductDrawingFormForUserComponent', () => {
  let component: CreateProductDrawingFormForUserComponent;
  let fixture: ComponentFixture<CreateProductDrawingFormForUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProductDrawingFormForUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductDrawingFormForUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
