import { Injectable } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendErrorService {
  // tslint:disable-next-line:variable-name
   backendError: HttpErrorResponse;
  constructor() { }
  getbackendError(): HttpErrorResponse {
    return this.backendError;
  }
  setbackendError(httpErrorResponse: HttpErrorResponse): void {
    this.backendError = httpErrorResponse ;
  }
  getBackendErrorMessage(): string{
    let errorMessage: string;
    if (this.backendError){
      errorMessage = this.backendError.error.message;
    }
    return errorMessage;
  }
}
