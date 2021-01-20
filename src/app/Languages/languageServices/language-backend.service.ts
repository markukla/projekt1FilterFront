import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {DimensionCodeTableService} from '../../DimensionCodes/DimensionCodeServices/dimension-code-table.service';
import {Observable} from 'rxjs';
import DimensionCode from '../../DimensionCodes/DimensionCodesTypesAnClasses/diemensionCode.entity';
import CreateDimensionCodeDto from '../../DimensionCodes/DimensionCodesTypesAnClasses/createDimensionCode.dto';
import {tap} from 'rxjs/operators';
import {API_URL} from '../../Config/apiUrl';
import Language from '../LanguageTypesAndClasses/languageEntity';
import {LanguageTableService} from './language-table.service';
import {LanguageDto} from '../LanguageTypesAndClasses/languageDto';

@Injectable({
  providedIn: 'root'
})
export class LanguageBackendService {
  rootURL = API_URL;
  endpointUrl = '/languages';

  constructor(private http: HttpClient,
              private tableService: LanguageTableService) {
  }

  getRecords(): Observable<HttpResponse<DimensionCode[]>> {
    return this.http.get<DimensionCode[]>(this.rootURL + this.endpointUrl, {observe: 'response'});
  }

  // tslint:disable-next-line:typedef
  addRecords(record: LanguageDto): Observable<HttpResponse<Language>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<Language>(this.rootURL + this.endpointUrl, record, {observe: 'response'}).pipe(
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

  updateRecordById(id: string, updatedRecord: LanguageDto): Observable<HttpResponse<Language>> {
    const updateUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.patch<Language>(updateUrl, updatedRecord, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.updateTableRecord(Number(id), record.body);
      }));
  }

  findRecordBycode(code: string): Observable<boolean> {
    const url = `${this.rootURL + this.endpointUrl}/codes/${code}`;
    return this.http.get<boolean>(url);
  }
  findRecordBycodeForUpdate(id: string, code: string): Observable<boolean> {
    const url = `${this.rootURL + this.endpointUrl}/${id}/codes/${code}`;
    return this.http.get<boolean>(url);
  }

  findRecordById(recordToUpdateId: string): Observable<HttpResponse<Language>> {
    const getUrl = `${this.rootURL + this.endpointUrl}/${recordToUpdateId}`;
    return this.http.get<Language>(getUrl, {observe: 'response'});
  }
}
