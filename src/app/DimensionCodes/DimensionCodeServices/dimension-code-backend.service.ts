import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ProductTypeTableService} from '../../Products/ProductType/ProductTypeServices/product-type-table.service';
import {Observable} from 'rxjs';
import ProductType from '../../Products/ProductTypesAndClasses/productType.entity';
import {tap} from 'rxjs/operators';
import {DimensionCodeTableService} from './dimension-code-table.service';
import DimensionCode from '../DimensionCodesTypesAnClasses/diemensionCode.entity';
import CreateDimensionCodeDto from '../DimensionCodesTypesAnClasses/createDimensionCode.dto';
import {API_URL} from '../../Config/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class DimensionCodeBackendService {
  rootURL = API_URL;
  endpointUrl = '/dimensionCodes';

  constructor(private http: HttpClient,
              private tableService: DimensionCodeTableService) {
  }

  getRecords(): Observable<HttpResponse<DimensionCode[]>> {
    return this.http.get<DimensionCode[]>(this.rootURL + this.endpointUrl, {observe: 'response'});
  }

  getFirstIndexDimensions(): Observable<HttpResponse<DimensionCode[]>> {
    return this.http.get<DimensionCode[]>(this.rootURL + this.endpointUrl + '/roles/indexDimensions/first', {observe: 'response'});
  }

  getSecondIndexDimensions(): Observable<HttpResponse<DimensionCode[]>> {
    return this.http.get<DimensionCode[]>(this.rootURL + this.endpointUrl + '/roles/indexDimensions/second', {observe: 'response'});

  }
  getNonIndexDimensions(): Observable<HttpResponse<DimensionCode[]>> {
    return this.http.get<DimensionCode[]>(this.rootURL + this.endpointUrl + '/roles/indexDimensions/non', {observe: 'response'});

  }

  // tslint:disable-next-line:typedef
  addRecords(record: CreateDimensionCodeDto): Observable<HttpResponse<DimensionCode>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<DimensionCode>(this.rootURL + this.endpointUrl, record, {observe: 'response'}).pipe(
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

  updateRecordById(id: string, updatedRecord: CreateDimensionCodeDto): Observable<HttpResponse<DimensionCode>> {
    const updateUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.patch<DimensionCode>(updateUrl, updatedRecord, {observe: 'response'}).pipe(
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

  findRecordById(recordToUpdateId: string): Observable<HttpResponse<DimensionCode>> {
    const getUrl = `${this.rootURL + this.endpointUrl}/${recordToUpdateId}`;
    return this.http.get<DimensionCode>(getUrl, {observe: 'response'});
  }
}
