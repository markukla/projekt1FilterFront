import { TestBed } from '@angular/core/testing';

import { VersionRegisterTableService } from './version-register-table.service';

describe('VersionRegisterTableService', () => {
  let service: VersionRegisterTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionRegisterTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
