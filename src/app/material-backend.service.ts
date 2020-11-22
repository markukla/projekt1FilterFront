import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Material} from './materials/material';


@Injectable({
  providedIn: 'root'
})
export class MaterialBackendService {

  rootURL = '/api';
  constructor(private http: HttpClient) {
  }
  getMaterials(): Observable<HttpResponse<Material[]>> {
    return this.http.get<Material[]>('http://localhost:5000/materials', { observe: 'response'});
  }

  // tslint:disable-next-line:typedef
  addMaterials(material: Material): Observable<HttpResponse<Material>> {
    return this.http.post<Material>('http://localhost:5000/materials', material, { observe: 'response'}).pipe(catchError(this.handleError));
  }

  deleteMaterialById(id: string): Observable<HttpResponse<any>> {
    const deleteUrl = `http://localhost:5000/materials/${id}`;
    return this.http.delete(deleteUrl,  { observe: 'response'}).pipe(catchError(this.handleError));
  }

  updateMaterialById(id: string, material: Material): Observable<HttpResponse<Material>> {
    const deleteUrl = `http://localhost:5000/materials/${id}`;
    return this.http.patch<Material>(deleteUrl, material, { observe: 'response'}).pipe(catchError(this.handleError));
  }
  findMaterialBycode (materiaCode: string): Observable<Material> {
    const url = `http://localhost:5000/materials/?code=${materiaCode}`;
    return this.http.get<Material>(url).pipe(catchError(this.handleError));

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
