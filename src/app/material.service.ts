import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Material} from './materials/material';


@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  rootURL = '/api';
  constructor(private http: HttpClient) {
  }


  // tslint:disable-next-line:typedef
  getMaterials() {
    return this.http.get<Material[]>('http://localhost:5000/materials');
  }

  // tslint:disable-next-line:typedef
   addMaterials(material: Material): Observable<Material> {
    return this.http.post<Material>('http://localhost:5000/materials', material).pipe(catchError(this.handleError));
  }
  // tslint:disable-next-line:typedef
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      `Something bad happened: please try again later`);
  }
}
