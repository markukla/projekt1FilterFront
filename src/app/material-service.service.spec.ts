import { TestBed } from '@angular/core/testing';

import { MaterialService } from './material.service';

describe('MaterialServiceService', () => {
  let service: MaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
