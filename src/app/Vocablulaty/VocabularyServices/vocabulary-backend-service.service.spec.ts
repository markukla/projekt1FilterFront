import { TestBed } from '@angular/core/testing';

import { VocabularyBackendServiceService } from './vocabulary-backend-service.service';

describe('VocabularyBackendServiceService', () => {
  let service: VocabularyBackendServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VocabularyBackendServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
