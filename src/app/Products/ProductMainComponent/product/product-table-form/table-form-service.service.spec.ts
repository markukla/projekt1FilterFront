import { TestBed } from '@angular/core/testing';

import { TableFormServiceService } from './table-form-service.service';

describe('TableFormServiceService', () => {
  let service: TableFormServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableFormServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
