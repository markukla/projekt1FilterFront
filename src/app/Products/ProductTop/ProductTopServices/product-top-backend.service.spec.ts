import { TestBed } from '@angular/core/testing';

import { ProductTopBackendService } from './product-top-backend.service';

describe('ProductTopBackendService', () => {
  let service: ProductTopBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductTopBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
