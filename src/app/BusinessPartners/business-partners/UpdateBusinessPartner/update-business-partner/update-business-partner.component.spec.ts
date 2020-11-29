import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBusinessPartnerComponent } from './update-business-partner.component';

describe('UpdateBusinessPartnerComponent', () => {
  let component: UpdateBusinessPartnerComponent;
  let fixture: ComponentFixture<UpdateBusinessPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBusinessPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBusinessPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
