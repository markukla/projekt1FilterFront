import { TestBed } from '@angular/core/testing';

import { ValidateDiemensionCodeService } from './validate-diemension-code.service';

describe('ValidateDiemensionCodeService', () => {
  let service: ValidateDiemensionCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateDiemensionCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
