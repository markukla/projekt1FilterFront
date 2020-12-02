import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProductTopComponent } from './update-product-top.component';

describe('UpdateProductTopComponent', () => {
  let component: UpdateProductTopComponent;
  let fixture: ComponentFixture<UpdateProductTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProductTopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProductTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
