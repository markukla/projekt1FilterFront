import { TestBed } from '@angular/core/testing';

import { EditorsTableService } from './editors-table.service';

describe('EditorsTableService', () => {
  let service: EditorsTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorsTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
