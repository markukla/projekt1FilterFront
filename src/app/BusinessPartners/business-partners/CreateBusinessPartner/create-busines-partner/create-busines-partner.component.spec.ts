import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBusinesPartnerComponent } from './create-busines-partner.component';

describe('CreateBusinesPartnerComponent', () => {
  let component: CreateBusinesPartnerComponent;
  let fixture: ComponentFixture<CreateBusinesPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBusinesPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBusinesPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
