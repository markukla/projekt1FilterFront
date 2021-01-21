import { TestBed } from '@angular/core/testing';

import { BackendMessageService } from './backend-message.service';

describe('BackendErrorService', () => {
  let service: BackendMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
