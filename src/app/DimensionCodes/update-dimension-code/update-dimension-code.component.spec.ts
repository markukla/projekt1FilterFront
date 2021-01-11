import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDImensionCodeComponent } from './update-dimension-code.component';

describe('UpdateDImensionCodeComponent', () => {
  let component: UpdateDImensionCodeComponent;
  let fixture: ComponentFixture<UpdateDImensionCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDImensionCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDImensionCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
