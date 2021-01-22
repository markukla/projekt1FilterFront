import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyMainComponentComponent } from './vocabulary-main-component.component';

describe('VocabularyMainComponentComponent', () => {
  let component: VocabularyMainComponentComponent;
  let fixture: ComponentFixture<VocabularyMainComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VocabularyMainComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabularyMainComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
