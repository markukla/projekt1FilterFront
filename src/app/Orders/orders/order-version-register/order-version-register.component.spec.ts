import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderVersionRegisterComponent } from './order-version-register.component';

describe('OrderVersionRegisterComponent', () => {
  let component: OrderVersionRegisterComponent;
  let fixture: ComponentFixture<OrderVersionRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderVersionRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderVersionRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
