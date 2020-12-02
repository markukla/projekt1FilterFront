import { Injectable } from '@angular/core';
import {MaterialBackendService} from '../../../materials/MaterialServices/material-backend.service';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ProductTopBackendService} from './product-top-backend.service';

@Injectable({
  providedIn: 'root'
})
export class ValidateProductTopService {
  constructor(private backendService: ProductTopBackendService) {
    console.log(this.backendService);
  }
  codeValidator(): AsyncValidatorFn {
    return (
      ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.backendService.findRecordBycode(ctrl.value).pipe(map(istaken => (istaken  ? { taken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  nameValidator(): AsyncValidatorFn {
    return (
      ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.backendService. findRecordByName(ctrl.value).pipe(map(istaken => (istaken  ? { taken: true } : null)),
        catchError(() => of(null))
      );
    };
  }
}
