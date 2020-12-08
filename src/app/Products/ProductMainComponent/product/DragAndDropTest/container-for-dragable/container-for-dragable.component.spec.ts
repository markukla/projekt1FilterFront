import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerForDragableComponent } from './container-for-dragable.component';

describe('ContainerForDragableComponent', () => {
  let component: ContainerForDragableComponent;
  let fixture: ComponentFixture<ContainerForDragableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerForDragableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerForDragableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
