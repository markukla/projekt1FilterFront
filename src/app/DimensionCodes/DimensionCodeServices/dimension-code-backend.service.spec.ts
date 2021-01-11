import { TestBed } from '@angular/core/testing';

import { DimensionCodeBackendService } from './dimension-code-backend.service';

describe('DimensionCodeBackendService', () => {
  let service: DimensionCodeBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DimensionCodeBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
