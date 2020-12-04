import { TestBed } from '@angular/core/testing';

import { ValidateProductTypeService } from './validate-product-type.service';

describe('ValidateProductTypeService', () => {
  let service: ValidateProductTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateProductTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
