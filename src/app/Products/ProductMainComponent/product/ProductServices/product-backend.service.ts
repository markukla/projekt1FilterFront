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

@Injectable({
  providedIn: 'root'
})
export class ProductBackendService {
  rootURL = API_URL;
  endpointUrl = '/products';
  createProductDto: CreateProductDto;
  constructor(private http: HttpClient,
              private tableService: ProductTableService) {
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
        this.tableService.addRecordToTable(record.body);
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
        this.tableService.updateTableRecord(Number(id), record.body);
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
}
