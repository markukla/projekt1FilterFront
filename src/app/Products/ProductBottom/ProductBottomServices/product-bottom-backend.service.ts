import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ProductTopTableService} from '../../ProductTop/ProductTopServices/product-top-table.service';
import {Observable} from 'rxjs';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import {tap} from 'rxjs/operators';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import {ProductBottomTableService} from './product-bottom-table.service';
import ProductBottom from '../../ProductTypesAndClasses/productBottom.entity';

@Injectable({
  providedIn: 'root'
})
export class ProductBottomBackendService {
  rootURL = 'http://localhost:5000';
  endpointUrl = '/productBottoms';
  constructor(private http: HttpClient,
              private tableService: ProductBottomTableService) {
  }

  getRecords(): Observable<HttpResponse<ProductBottom[]>> {
    return this.http.get<ProductBottom[]>(this.rootURL + this.endpointUrl, {observe: 'response'});
  }

  // tslint:disable-next-line:typedef
  addRecords(record: ProductTop): Observable<HttpResponse<ProductBottom>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<ProductBottom>(this.rootURL + this.endpointUrl, record, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.addRecordToTable(record.body);
      }));
  }

  deleteRecordById(id: string): Observable<HttpResponse<any>> {
    const deleteUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.delete(deleteUrl, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
        this.tableService.deleteRecordById(Number(id));
      }));
  }

  updateRecordById(id: string, material: Material): Observable<HttpResponse<ProductBottom>> {
    const updateUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.patch<ProductBottom>(updateUrl, material, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.updateTableRecord(Number(id), record.body);
      }));
  }

  findRecordBycode(code: string): Observable<boolean> {
    const url = `${this.rootURL + this.endpointUrl}/codes/${code}`;
    return this.http.get<boolean>(url);

  }
  findRecordByName(name: string): Observable<boolean> {
    const url = `${this.rootURL + this.endpointUrl}/names/${name}`;
    return this.http.get<boolean>(url);

  }
  findRecordBycodeForUpdate(id: string, code: string): Observable<boolean> {
    const url = `${this.rootURL + this.endpointUrl}/${id}/codes/${code}`;
    return this.http.get<boolean>(url);
  }
  findRecordByNameForUpdate(id: string, name: string): Observable<boolean> {
    const url = `${this.rootURL + this.endpointUrl}/${id}/names/${name}`;
    return this.http.get<boolean>(url);
  }
  findRecordById(recordToUpdateId: string): Observable<HttpResponse<ProductBottom>> {
    const getUrl = `${this.rootURL + this.endpointUrl}/${recordToUpdateId}`;
    return this.http.get<ProductBottom>(getUrl, {observe: 'response'} );
  }
}
