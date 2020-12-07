import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomsForProductTypeComponent } from './bottoms-for-product-type.component';

describe('BottomsForProductTypeComponent', () => {
  let component: BottomsForProductTypeComponent;
  let fixture: ComponentFixture<BottomsForProductTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomsForProductTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomsForProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
