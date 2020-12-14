import { TestBed } from '@angular/core/testing';

import { OrderBackendService } from './order-backend.service';

describe('OrderBackendService', () => {
  let service: OrderBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
