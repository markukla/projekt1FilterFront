import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ProductTopTableService} from '../../ProductTop/ProductTopServices/product-top-table.service';
import {Observable} from 'rxjs';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import {tap} from 'rxjs/operators';
import {ProductTypeTableService} from './product-type-table.service';
import ProductType from '../../ProductTypesAndClasses/productType.entity';
import {API_URL} from '../../../Config/apiUrl';
import {ProductTopForTableCell} from '../../ProductTypesAndClasses/productTopForTableCell';
import {getSelectedLanguageFromNamesInAllLanguages} from '../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';
import {ProductTypeForTableCell} from '../../ProductTypesAndClasses/productTypeForTableCell';
import {GeneralTableService} from '../../../util/GeneralTableService/general-table.service';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeBackendService {
  rootURL = API_URL;
  endpointUrl = '/productTypes';
  constructor(private http: HttpClient,
              private tableService: GeneralTableService,
              private authenticationService: AuthenticationService) {
  }

  getRecords(): Observable<HttpResponse<ProductType[]>> {
    return this.http.get<ProductType[]>(this.rootURL + this.endpointUrl, {observe: 'response'});
  }

  // tslint:disable-next-line:typedef
  addRecords(record: ProductType): Observable<HttpResponse<ProductType>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<ProductType>(this.rootURL + this.endpointUrl, record, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.addRecordToTable(this.createProductTypeForTableCellFromProductTop(record.body));
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

  updateRecordById(id: string, updatedRecord: ProductType): Observable<HttpResponse<ProductType>> {
    const updateUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.patch<ProductType>(updateUrl, updatedRecord, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.updateTableRecord(Number(id), this.createProductTypeForTableCellFromProductTop(record.body));
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
  findRecordById(recordToUpdateId: string): Observable<HttpResponse<ProductType>> {
    const getUrl = `${this.rootURL + this.endpointUrl}/${recordToUpdateId}`;
    return this.http.get<ProductType>(getUrl, {observe: 'response'} );
  }

  createProductTypeForTableCellFromProductTop(productType: ProductType): ProductTopForTableCell {
    // tslint:disable-next-line:max-line-length
    const localizedNameInSelectedLanguage = getSelectedLanguageFromNamesInAllLanguages(productType.localizedNames, this.authenticationService.selectedLanguageCode);
    const productTypeForTableCell: ProductTypeForTableCell = {
      ...productType,
      localizedNameInSelectedLanguage,
    };
    return productTypeForTableCell;
  }
}

