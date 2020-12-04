import { Injectable } from '@angular/core';
import {ProductTopBackendService} from '../../ProductTop/ProductTopServices/product-top-backend.service';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ProductTypeTableService} from './product-type-table.service';
import {ProductTypeBackendService} from './product-type-backend.service';

@Injectable({
  providedIn: 'root'
})
export class ValidateProductTypeService {
  constructor(private backendService: ProductTypeBackendService) {
    console.log(this.backendService);
  }

  codeValidator(): AsyncValidatorFn {
    return (
      ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.backendService.findRecordBycode(ctrl.value).pipe(map(istaken => (istaken ? {taken: true} : null)),
        catchError(() => of(null))
      );
    };
  }

  codeValidatorForUpdate(id: string): AsyncValidatorFn {
    return (
      ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.backendService.findRecordBycodeForUpdate(id, ctrl.value).pipe(map(istaken => (istaken ? {taken: true} : null)),
        catchError(() => of(null))
      );
    };
  }

  nameValidator(): AsyncValidatorFn {
    return (
      ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.backendService.findRecordByName(ctrl.value).pipe(map(istaken => (istaken ? {taken: true} : null)),
        catchError(() => of(null))
      );
    };
  }

  nameValidatorForUpdate(id: string): AsyncValidatorFn {
    return (
      ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.backendService.findRecordByNameForUpdate(id, ctrl.value).pipe(map(istaken => (istaken ? {taken: true} : null)),
        catchError(() => of(null))
      );
    };
  }
}
