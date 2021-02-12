import { TestBed } from '@angular/core/testing';

import { OperationStatusServiceService } from './operation-status-service.service';

describe('OperationStatusServiceService', () => {
  let service: OperationStatusServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationStatusServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
