import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordForLoggedUserComponent } from './change-password-for-logged-user.component';

describe('ChangePasswordComponentComponent', () => {
  let component: ChangePasswordForLoggedUserComponent;
  let fixture: ComponentFixture<ChangePasswordForLoggedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePasswordForLoggedUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordForLoggedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
