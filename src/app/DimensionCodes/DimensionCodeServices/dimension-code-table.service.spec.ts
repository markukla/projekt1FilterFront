import { TestBed } from '@angular/core/testing';

import { DimensionCodeTableService } from './dimension-code-table.service';

describe('DimensionCodeTableService', () => {
  let service: DimensionCodeTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DimensionCodeTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
