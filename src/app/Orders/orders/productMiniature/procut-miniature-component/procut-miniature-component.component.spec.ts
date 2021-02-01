import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcutMiniatureComponentComponent } from './procut-miniature-component.component';

describe('ProcutMiniatureComponentComponent', () => {
  let component: ProcutMiniatureComponentComponent;
  let fixture: ComponentFixture<ProcutMiniatureComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcutMiniatureComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcutMiniatureComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
