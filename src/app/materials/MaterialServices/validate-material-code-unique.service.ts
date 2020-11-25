import { Injectable } from '@angular/core';
import {AbstractControl, AsyncValidator, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MaterialBackendService} from './material-backend.service';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidateMaterialCodeUniqueService  {
  constructor(private materialBackendService: MaterialBackendService) {
    console.log(this.materialBackendService);
  }
  materialCodeValidator(): AsyncValidatorFn {
 return (
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return this.materialBackendService.findMaterialBycode(ctrl.value).pipe(map(istaken => (istaken  ? { taken: true } : null)),
      catchError(() => of(null))
    );
  };
  }
}
