import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ProductTopTableService} from '../../ProductTop/ProductTopServices/product-top-table.service';
import {Observable} from 'rxjs';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import {tap} from 'rxjs/operators';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import {ProductBottomTableService} from './product-bottom-table.service';
import ProductBottom from '../../ProductTypesAndClasses/productBottom.entity';
import {API_URL} from '../../../Config/apiUrl';
import {ProductTopForTableCell} from '../../ProductTypesAndClasses/productTopForTableCell';
import {getSelectedLanguageFromNamesInAllLanguages} from '../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage';
import {ProductBottomForTableCell} from '../../ProductTypesAndClasses/productBottomForTableCell';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';
import {GeneralTableService} from '../../../util/GeneralTableService/general-table.service';
import CreateProductBottomDto from '../../ProductTypesAndClasses/createProductBottom.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductBottomBackendService {
  rootURL = API_URL;
  endpointUrl = '/productBottoms';
  constructor(private http: HttpClient,
              private tableService: GeneralTableService,
              private authenticationService: AuthenticationService) {
  }

  getRecords(): Observable<HttpResponse<ProductBottom[]>> {
    return this.http.get<ProductBottom[]>(this.rootURL + this.endpointUrl, {observe: 'response'});
  }

  // tslint:disable-next-line:typedef
  addRecords(record: CreateProductBottomDto): Observable<HttpResponse<ProductBottom>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<ProductBottom>(this.rootURL + this.endpointUrl, record, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.addRecordToTable(this.createProductBottomForTableCellFromProductTop(record.body));
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

  updateRecordById(id: string, record: CreateProductBottomDto): Observable<HttpResponse<ProductBottom>> {
    const updateUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.patch<ProductBottom>(updateUrl, record, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.updateTableRecord(Number(id), this.createProductBottomForTableCellFromProductTop(record.body));
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

  createProductBottomForTableCellFromProductTop(productBottom: ProductBottom): ProductBottomForTableCell {
    // tslint:disable-next-line:max-line-length
    const localizedNameInSelectedLanguage = getSelectedLanguageFromNamesInAllLanguages(productBottom.localizedNames, this.authenticationService.selectedLanguageCode);
    const productTopForTableCell: ProductTopForTableCell = {
      ...productBottom,
      localizedNameInSelectedLanguage,
    };
    return productTopForTableCell;
  }
}
