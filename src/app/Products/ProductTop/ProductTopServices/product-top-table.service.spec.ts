import { TestBed } from '@angular/core/testing';

import { ProductTopTableService } from './product-top-table.service';

describe('ProductTopTableService', () => {
  let service: ProductTopTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductTopTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
