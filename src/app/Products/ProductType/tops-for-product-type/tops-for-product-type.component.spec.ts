import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopsForProductTypeComponent } from './tops-for-product-type.component';

describe('TopsForProductTypeComponent', () => {
  let component: TopsForProductTypeComponent;
  let fixture: ComponentFixture<TopsForProductTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopsForProductTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopsForProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
