import { TestBed } from '@angular/core/testing';

import { BusinessPartnerTableService } from './business-partner-table.service';

describe('BusinessPartnerTableService', () => {
  let service: BusinessPartnerTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessPartnerTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
