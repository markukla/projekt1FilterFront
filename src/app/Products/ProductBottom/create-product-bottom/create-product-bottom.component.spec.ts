import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductBottomComponent } from './create-product-bottom.component';

describe('CreateProductBottomComponent', () => {
  let component: CreateProductBottomComponent;
  let fixture: ComponentFixture<CreateProductBottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProductBottomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
