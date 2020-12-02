import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {MaterialTableService} from '../../../materials/MaterialServices/material-table.service';
import {Observable} from 'rxjs';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import {tap} from 'rxjs/operators';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import {ProductTopTableService} from './product-top-table.service';

@Injectable({
  providedIn: 'root'
})
export class ProductTopBackendService {
  rootURL = 'http://localhost:5000';
  endpointUrl = '/productTops';
  constructor(private http: HttpClient,
              private tableService: ProductTopTableService) {
  }

  getRecords(): Observable<HttpResponse<ProductTop[]>> {
    return this.http.get<ProductTop[]>(this.rootURL + this.endpointUrl, {observe: 'response'});
  }

  // tslint:disable-next-line:typedef
  addRecords(record: ProductTop): Observable<HttpResponse<ProductTop>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<ProductTop>(this.rootURL + this.endpointUrl, record, {observe: 'response'}).pipe(
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

  updateRecordById(id: string, material: Material): Observable<HttpResponse<ProductTop>> {
    const updateUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.patch<ProductTop>(updateUrl, material, {observe: 'response'}).pipe(
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
  findRecordById(recordToUpdateId: string): Observable<HttpResponse<ProductTop>> {
    const getUrl = `${this.rootURL + this.endpointUrl}/${recordToUpdateId}`;
    return this.http.get<ProductTop>(getUrl, {observe: 'response'} );
  }
}
