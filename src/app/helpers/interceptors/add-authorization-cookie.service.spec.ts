import { TestBed } from '@angular/core/testing';

import { AddAuthorizationCookieInterceptorService } from './add-authorization-cookie-interceptor.service';

describe('AddAuthorizationCookieService', () => {
  let service: AddAuthorizationCookieInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddAuthorizationCookieInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
