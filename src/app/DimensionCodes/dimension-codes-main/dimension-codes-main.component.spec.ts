import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionCodesMainComponent } from './dimension-codes-main.component';

describe('DimensionCodesMainComponent', () => {
  let component: DimensionCodesMainComponent;
  let fixture: ComponentFixture<DimensionCodesMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DimensionCodesMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DimensionCodesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
