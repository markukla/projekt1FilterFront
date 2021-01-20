import { TestBed } from '@angular/core/testing';

import { ValidateLanguageService } from './validate-language.service';

describe('ValidateLanguageService', () => {
  let service: ValidateLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
