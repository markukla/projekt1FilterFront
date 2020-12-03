import { TestBed } from '@angular/core/testing';

import { ProductBottomValidatorService } from './product-bottom-validator.service';

describe('ProductBottomValidatorService', () => {
  let service: ProductBottomValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductBottomValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
