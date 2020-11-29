import { Injectable } from '@angular/core';
import {MaterialBackendService} from '../../materials/MaterialServices/material-backend.service';
import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {UserBackendService} from './user-backend.service';

@Injectable({
  providedIn: 'root'
})
export class UserValidatorService {

  constructor(private userBackendService: UserBackendService) {
  }

   patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }
  // tslint:disable-next-line:typedef
   passwordMatchValidator( error: ValidationErrors): ValidatorFn {
     return (control: AbstractControl): { [key: string]: any } => {
       const password: string = control.get('password').value; // get password from our password form control
       const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
       // compare is the password math
       let valid = true;
       if (password !== confirmPassword) {
         // if they don't match, set an error in our confirmPassword form control
         control.get('confirmPassword').setErrors({NoPassswordMatch: true});
         valid = false;
       }
       return valid ? null : error;
     };
  }
  emailAsyncValidator(): AsyncValidatorFn {
    return (
      ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.userBackendService.findUserByEmail(ctrl.value).pipe(map(istaken => (istaken  ? { taken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  emailAsyncValidatorForUpdate(id: string): AsyncValidatorFn {
    return (
      ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.userBackendService.findUserByEmail(ctrl.value).pipe(map(istaken => (istaken  ? { taken: true } : null)),
        catchError(() => of(null))
      );
    };
  }



}
