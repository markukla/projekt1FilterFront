import { TestBed } from '@angular/core/testing';

import { ProductTypeTableService } from './product-type-table.service';

describe('ProductTypeTableService', () => {
  let service: ProductTypeTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductTypeTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
