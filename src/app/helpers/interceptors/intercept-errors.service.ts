import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';
import {BackendErrorService} from '../ErrorHandling/backend-error.service';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorsInterceptorService implements HttpInterceptor{

  constructor(private backendErrorService: BackendErrorService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   /* if (this.backendErrorService.backendError) {
      this.backendErrorService.setbackendError(null);if (this.backendErrorService.backendError) {
      this.backendErrorService.setbackendError(null);} */
    return next.handle(request).pipe(
      catchError(
        this.handleError
      ));
}

  private handleError(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `message was: ${error.error.message}`);
      let backendErrorRespone: HttpErrorResponse = new HttpErrorResponse(error);
     // this.backendErrorService.setbackendError(backendErrorRespone); backendErrorSerrvice is undefined ????!!!!
     // const backendErrorMessage = this.backendErrorService.getBackendErrorMessage();
      // console.log(`backendErrorService message= ${backendErrorMessage} `);
    }
    // Return an observable with a user-facing error message.
    return throwError(error);
  }

}
