import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewMaterialComponent } from './create-new-material.component';

describe('CreateNewMaterialComponent', () => {
  let component: CreateNewMaterialComponent;
  let fixture: ComponentFixture<CreateNewMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
