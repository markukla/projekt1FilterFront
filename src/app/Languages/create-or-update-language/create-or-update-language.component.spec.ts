import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrUpdateLanguageComponent } from './create-or-update-language.component';

describe('CreateOrUpdateLanguageComponent', () => {
  let component: CreateOrUpdateLanguageComponent;
  let fixture: ComponentFixture<CreateOrUpdateLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrUpdateLanguageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrUpdateLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
