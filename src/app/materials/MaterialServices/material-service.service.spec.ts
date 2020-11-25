import { TestBed } from '@angular/core/testing';

import { MaterialBackendService } from './material-backend.service';

describe('MaterialServiceService', () => {
  let service: MaterialBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
