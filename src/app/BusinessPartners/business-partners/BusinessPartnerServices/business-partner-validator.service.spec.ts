import { TestBed } from '@angular/core/testing';

import { BusinessPartnerValidatorService } from './business-partner-validator.service';

describe('BusinessPartnerValidatorService', () => {
  let service: BusinessPartnerValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessPartnerValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
