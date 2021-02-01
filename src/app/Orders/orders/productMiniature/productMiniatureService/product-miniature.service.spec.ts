import { TestBed } from '@angular/core/testing';

import { ProductMiniatureService } from './product-miniature.service';

describe('ProductMiniatureService', () => {
  let service: ProductMiniatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductMiniatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
