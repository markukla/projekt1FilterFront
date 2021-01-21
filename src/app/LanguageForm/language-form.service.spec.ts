import { TestBed } from '@angular/core/testing';

import { LanguageFormService } from './language-form.service';

describe('LanguageFormService', () => {
  let service: LanguageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
