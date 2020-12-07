import { TestBed } from '@angular/core/testing';

import { ProductBackendService } from './product-backend.service';

describe('ProductBackendService', () => {
  let service: ProductBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
