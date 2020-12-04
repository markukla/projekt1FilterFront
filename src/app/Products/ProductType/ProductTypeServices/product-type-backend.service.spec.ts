import { TestBed } from '@angular/core/testing';

import { ProductTypeBackendService } from './product-type-backend.service';

describe('ProductTypeBackendService', () => {
  let service: ProductTypeBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductTypeBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
