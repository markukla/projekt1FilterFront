import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductTopComponent } from './create-product-top.component';

describe('CreateProductTopComponent', () => {
  let component: CreateProductTopComponent;
  let fixture: ComponentFixture<CreateProductTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProductTopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
