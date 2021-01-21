import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangageFormComponentComponent } from './langage-form-component.component';

describe('LangageFormComponentComponent', () => {
  let component: LangageFormComponentComponent;
  let fixture: ComponentFixture<LangageFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LangageFormComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LangageFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
