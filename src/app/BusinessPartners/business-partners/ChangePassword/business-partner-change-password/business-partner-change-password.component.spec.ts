import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPartnerChangePasswordComponent } from './business-partner-change-password.component';

describe('BusinessPartnerChangePasswordComponent', () => {
  let component: BusinessPartnerChangePasswordComponent;
  let fixture: ComponentFixture<BusinessPartnerChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessPartnerChangePasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessPartnerChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
