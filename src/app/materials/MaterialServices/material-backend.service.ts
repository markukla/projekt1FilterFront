import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Material} from '../MaterialsMainComponent/material';
import {MaterialTableService} from './material-table.service';
import {API_URL} from '../../Config/apiUrl';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';


@Injectable({
  providedIn: 'root'
})
export class MaterialBackendService {
  rootURL = API_URL;
  endpointUrl = '/materials';
  constructor(private http: HttpClient,
              private materialTableService: GeneralTableService) {
  }

  getRecords(): Observable<HttpResponse<Material[]>> {
    return this.http.get<Material[]>(this.rootURL + this.endpointUrl, {observe: 'response'});
  }

  // tslint:disable-next-line:typedef
  addRecords(material: Material): Observable<HttpResponse<Material>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<Material>(this.rootURL + this.endpointUrl, material, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
        this.materialTableService.addRecordToTable(material.body);
      }));
  }

  deleteRecordById(id: string): Observable<HttpResponse<any>> {
    const deleteUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.delete(deleteUrl, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
        this.materialTableService.deleteRecordById(Number(id));
      }));
  }

  updateRecordById(id: string, material: Material): Observable<HttpResponse<Material>> {
    const updateUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.patch<Material>(updateUrl, material, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
      this.materialTableService.updateTableRecord(Number(id), material.body);
      }));
  }

  findRecordBycode(materiaCode: string): Observable<boolean> {
    const url = `${this.rootURL + this.endpointUrl}/codes/${materiaCode}`;
    return this.http.get<boolean>(url);

  }
  findRecordByName(materiaName: string): Observable<boolean> {
    const url = `${this.rootURL + this.endpointUrl}/names/${materiaName}`;
    return this.http.get<boolean>(url);

  }
  findRecordById(materialToUpdateId: string): Observable<HttpResponse<Material>> {
    const getUrl = `${this.rootURL + this.endpointUrl}/${materialToUpdateId}`;
    return this.http.get<Material>(getUrl, {observe: 'response'} );
  }
}
