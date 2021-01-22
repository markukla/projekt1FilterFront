import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrUpdateVocabularyComponent } from './create-or-update-vocabulary.component';

describe('CreateOrUpdateVocabularyComponent', () => {
  let component: CreateOrUpdateVocabularyComponent;
  let fixture: ComponentFixture<CreateOrUpdateVocabularyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrUpdateVocabularyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrUpdateVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
