import { TestBed } from '@angular/core/testing';

import { LanguageBackendService } from './language-backend.service';

describe('LanguageBackendService', () => {
  let service: LanguageBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
