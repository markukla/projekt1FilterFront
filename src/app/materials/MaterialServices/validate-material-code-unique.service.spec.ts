import { TestBed } from '@angular/core/testing';

import { ValidateMaterialCodeUniqueService } from './validate-material-code-unique.service';

describe('ValidateMaterialCodeUniqueService', () => {
  let service: ValidateMaterialCodeUniqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateMaterialCodeUniqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
