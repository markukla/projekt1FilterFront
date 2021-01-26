import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ProductTypeTableService} from '../../../ProductType/ProductTypeServices/product-type-table.service';
import {Observable} from 'rxjs';
import ProductType from '../../../ProductTypesAndClasses/productType.entity';
import {tap} from 'rxjs/operators';
import {ProductTableService} from './product-table.service';
import Product from '../../../ProductTypesAndClasses/product.entity';
import CreateProductDto from '../../../ProductTypesAndClasses/product.dto';
import {DrawingPaths} from '../../../ProductTypesAndClasses/drawingPaths';
import ProductBottom from '../../../ProductTypesAndClasses/productBottom.entity';
import ProductTop from '../../../ProductTypesAndClasses/productTop.entity';
import {API_URL} from '../../../../Config/apiUrl';
import {ProductTopForTableCell} from '../../../ProductTypesAndClasses/productTopForTableCell';
import {getSelectedLanguageFromNamesInAllLanguages} from '../../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage';
import {AuthenticationService} from '../../../../LoginandLogOut/AuthenticationServices/authentication.service';
import {GeneralTableService} from '../../../../util/GeneralTableService/general-table.service';
import {ProductTopBackendService} from '../../../ProductTop/ProductTopServices/product-top-backend.service';
import {ProductTypeBackendService} from '../../../ProductType/ProductTypeServices/product-type-backend.service';
import {ProductBottomBackendService} from '../../../ProductBottom/ProductBottomServices/product-bottom-backend.service';
import {ProductForTableCell} from '../../../ProductTypesAndClasses/productForTableCell';

@Injectable({
  providedIn: 'root'
})
export class ProductBackendService {
  rootURL = API_URL;
  endpointUrl = '/products';
  createProductDto: CreateProductDto;
  constructor(private http: HttpClient,
              private tableService: GeneralTableService,
              private productTopBackednService: ProductTopBackendService,
              private productTypeBackednService: ProductTypeBackendService,
              private productBottommBackednService: ProductBottomBackendService,
              private authenticationService: AuthenticationService) {
  }

  getRecords(): Observable<HttpResponse<Product[]>> {
    return this.http.get<Product[]>(this.rootURL + this.endpointUrl, {observe: 'response'});
  }

  // tslint:disable-next-line:typedef
  addRecords(record: CreateProductDto): Observable<HttpResponse<Product>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<Product>(this.rootURL + this.endpointUrl, record, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.addRecordToTable(this.createProductForTableCellFromProductTop(record.body));
      }));
  }
  getProductByTypeTopBottom(record: CreateProductDto): Observable<HttpResponse<Product>> {
    // tslint:disable-next-line:max-line-length
    const url = `${this.rootURL + this.endpointUrl}/productInfo/getByTypeTopBottom`;
    return this.http.post<Product>(url, record, {observe: 'response'});
  }

  deleteRecordById(id: string): Observable<HttpResponse<any>> {
    const deleteUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.delete(deleteUrl, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
        this.tableService.deleteRecordById(Number(id));
      }));
  }

  updateRecordById(id: string, updatedRecord: CreateProductDto): Observable<HttpResponse<Product>> {
    const updateUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.patch<Product>(updateUrl, updatedRecord, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.updateTableRecord(Number(id), this.createProductForTableCellFromProductTop(record.body));
      }));
  }
  uploadDrawing(file: any): Observable<DrawingPaths> {
    const url = `${this.rootURL}/uploadDrawing`;
    return this.http.post<DrawingPaths>(url, file, /* {headers: {Accept: 'multipart/form-newData'}}*/);
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
  findRecordById(recordToUpdateId: string): Observable<HttpResponse<Product>> {
    const getUrl = `${this.rootURL + this.endpointUrl}/${recordToUpdateId}`;
    return this.http.get<Product>(getUrl, {observe: 'response'} );
  }
  getDrawingFromBakendEnpoint(urltoDrawingFromPublic: string): Observable<any> {
    const getUrl = this.rootURL + urltoDrawingFromPublic;
    return this.http.get<any>(getUrl);
  }
  createProductForTableCellFromProductTop(product: Product): ProductForTableCell {
    // tslint:disable-next-line:max-line-length
    const productTopName = this.productTopBackednService.createProductTopForTableCellFromProductTop(product.productTop).localizedNameInSelectedLanguage;
    // tslint:disable-next-line:max-line-length
    const productBottomName = this.productBottommBackednService.createProductBottomForTableCellFromProductTop(product.productBottom).localizedNameInSelectedLanguage;
    // tslint:disable-next-line:max-line-length
    const productTypeName = this.productTypeBackednService.createProductTypeForTableCellFromProductTop(product.productType).localizedNameInSelectedLanguage;
    const productForTableCell: ProductForTableCell = {
      ...product,
      productBottomCode: product.productBottom.code,
      productBottomNameInSelectedLanguage: productBottomName,
      productTopCode: product.productBottom.code,
      productTopNameInSelectedLanguage: productTopName,
      productTypeCode: product.productType.code,
      productTypeNameInSelectedLanguage: productTypeName,
      productBottomCodePlusNAme: product.productBottom.code + ' - ' + productBottomName,
      productTopCodePlusName: product.productTop.code + ' - ' + productTopName,
      productTypeCodePlusName: product.productType.code + ' - ' + productTypeName,
    };
    return productForTableCell;
  }
}
