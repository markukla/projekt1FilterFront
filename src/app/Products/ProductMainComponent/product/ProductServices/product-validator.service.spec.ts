import { TestBed } from '@angular/core/testing';

import { ProductValidatorService } from './product-validator.service';

describe('ProductValidatorService', () => {
  let service: ProductValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
