import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDrawingComponent } from './order-drawing.component';

describe('OrderDrawingComponent', () => {
  let component: OrderDrawingComponent;
  let fixture: ComponentFixture<OrderDrawingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDrawingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
