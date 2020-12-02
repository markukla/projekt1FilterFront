import { TestBed } from '@angular/core/testing';

import { ValidateProductTopService } from './validate-product-top.service';

describe('ValidateProductTopService', () => {
  let service: ValidateProductTopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateProductTopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
