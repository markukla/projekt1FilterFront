import { TestBed } from '@angular/core/testing';

import { ProductBottomBackendService } from './product-bottom-backend.service';

describe('ProductBottomBackendService', () => {
  let service: ProductBottomBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductBottomBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
