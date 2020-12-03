import { TestBed } from '@angular/core/testing';

import { ProductBottomTableService } from './product-bottom-table.service';

describe('ProductBottomTableService', () => {
  let service: ProductBottomTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductBottomTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
