import { TestBed } from '@angular/core/testing';

import { ConfirmDeleteServiceService } from './confirm-delete-service.service';

describe('ConfirmDeleteServiceService', () => {
  let service: ConfirmDeleteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmDeleteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
