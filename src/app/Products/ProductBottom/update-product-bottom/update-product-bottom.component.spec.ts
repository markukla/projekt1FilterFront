import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProductBottomComponent } from './update-product-bottom.component';

describe('UpdateProductBottomComponent', () => {
  let component: UpdateProductBottomComponent;
  let fixture: ComponentFixture<UpdateProductBottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProductBottomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProductBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
