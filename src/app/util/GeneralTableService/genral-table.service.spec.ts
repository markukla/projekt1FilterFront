import { TestBed } from '@angular/core/testing';

import { GeneralTableService } from './general-table.service';

describe('GenralTableService', () => {
  let service: GeneralTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
