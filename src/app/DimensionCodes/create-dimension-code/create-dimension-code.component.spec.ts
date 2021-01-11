import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDimensionCodeComponent } from './create-dimension-code.component';

describe('CreateDimensionCodeComponent', () => {
  let component: CreateDimensionCodeComponent;
  let fixture: ComponentFixture<CreateDimensionCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDimensionCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDimensionCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
