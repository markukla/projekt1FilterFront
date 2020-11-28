import { TestBed } from '@angular/core/testing';

import { BackendErrorService } from './backend-error.service';

describe('BackendErrorService', () => {
  let service: BackendErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
