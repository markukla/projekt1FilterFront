import { TestBed } from '@angular/core/testing';

import { BusinesPartnerBackendService } from './busines-partner-backend.service';

describe('BusinesPartnerBackendService', () => {
  let service: BusinesPartnerBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinesPartnerBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
