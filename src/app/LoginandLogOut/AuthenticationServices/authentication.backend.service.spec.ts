import { TestBed } from '@angular/core/testing';

import { AuthenticationBackendService } from './authentication.backend.service';

describe('LoginBackendService', () => {
  let service: AuthenticationBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
