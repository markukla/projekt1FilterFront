import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Material} from '../MaterialsMainComponent/material';
import {MaterialTableService} from './material-table.service';


@Injectable({
  providedIn: 'root'
})
export class MaterialBackendService {

  rootURL = '/api';

  constructor(private http: HttpClient,
              private materialTableService: MaterialTableService) {
  }

  getMaterials(): Observable<HttpResponse<Material[]>> {
    return this.http.get<Material[]>('http://localhost:5000/materials', {observe: 'response'});
  }

  // tslint:disable-next-line:typedef
  addMaterials(material: Material): Observable<HttpResponse<Material>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<Material>('http://localhost:5000/materials', material, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
        this.materialTableService.addRecordToTable(material.body);
      }));
  }

  deleteMaterialById(id: string): Observable<HttpResponse<any>> {
    const deleteUrl = `http://localhost:5000/materials/${id}`;
    return this.http.delete(deleteUrl, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
        this.materialTableService.deleteRecordById(Number(id));
      }));
  }

  updateMaterialById(id: string, material: Material): Observable<HttpResponse<Material>> {
    const updateUrl = `http://localhost:5000/materials/${id}`;
    return this.http.patch<Material>(updateUrl, material, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
      this.materialTableService.updateTableRecord(Number(id), material.body);
      }));
  }

  findMaterialBycode(materiaCode: string): Observable<boolean> {
    const url = `http://localhost:5000/materials/materialCode/${materiaCode}`;
    return this.http.get<boolean>(url);

  }
  findMaterialByName(materiaName: string): Observable<boolean> {
    const url = `http://localhost:5000/materials/materialName/${materiaName}`;
    return this.http.get<boolean>(url);

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
        `message was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      `Something bad happened: please try again later`);
  }


  findMaterialById(materialToUpdateId: string): Observable<HttpResponse<Material>> {
    const getUrl = `http://localhost:5000/materials/${materialToUpdateId}`;
    return this.http.get<Material>(getUrl, {observe: 'response'} );
  }
}
