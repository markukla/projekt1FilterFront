import { TestBed } from '@angular/core/testing';

import { ProductComunicationService } from './product-comunication.service';

describe('ProductComunicationService', () => {
  let service: ProductComunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductComunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
