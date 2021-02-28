import {Injectable} from '@angular/core';
import {API_URL} from '../../Config/apiUrl';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';
import {Observable} from 'rxjs';
import ProductTop from '../../Products/ProductTypesAndClasses/productTop.entity';
import CreateProductTopDto from '../../Products/ProductTypesAndClasses/createProductTop.dto';
import {tap} from 'rxjs/operators';
import {ProductTopForTableCell} from '../../Products/ProductTypesAndClasses/productTopForTableCell';
import {getSelectedLanguageFromNamesInAllLanguages} from '../../helpers/otherGeneralUseFunction/getNameInGivenLanguage';
import {Vocabulary} from '../VocabularyTypesAndClasses/VocabularyEntity';
import {CreateVocabularyDto} from '../VocabularyTypesAndClasses/VocabularyDto';
import {VocabularyForTableCell} from '../VocabularyTypesAndClasses/VocabularyForTableCell';

@Injectable({
  providedIn: 'root'
})
export class VocabularyBackendServiceService {
  rootURL = API_URL;
  endpointUrl = '/vocabularies';

  constructor(private http: HttpClient,
              private tableService: GeneralTableService,
  ) {
  }

  getRecords(): Observable<HttpResponse<Vocabulary[]>> {
    return this.http.get<Vocabulary[]>(this.rootURL + this.endpointUrl, {observe: 'response'});
  }

  // tslint:disable-next-line:typedef
  addRecords(record: CreateVocabularyDto, selectedLanguageCode: string): Observable<HttpResponse<Vocabulary>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<Vocabulary>(this.rootURL + this.endpointUrl, record, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.addRecordToTable(this.createVocabularryForTableCellFromVocabulary(record.body, selectedLanguageCode));
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

  updateRecordById(id: string, updatedRecord: CreateVocabularyDto, selectedLanguageCode: string): Observable<HttpResponse<Vocabulary>> {
    const updateUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.patch<Vocabulary>(updateUrl, updatedRecord, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.updateTableRecord(Number(id), this.createVocabularryForTableCellFromVocabulary(record.body, selectedLanguageCode));
      }));
  }

  findRecordByName(name: string): Observable<boolean> {
    const url = `${this.rootURL + this.endpointUrl}/variableNames/${name}`;
    return this.http.get<boolean>(url);
  }

  findRecordById(recordToUpdateId: string): Observable<HttpResponse<Vocabulary>> {
    const getUrl = `${this.rootURL + this.endpointUrl}/${recordToUpdateId}`;
    return this.http.get<Vocabulary>(getUrl, {observe: 'response'});
  }

  createVocabularryForTableCellFromVocabulary(vocabulary: Vocabulary, selectedLanguageCode: string): VocabularyForTableCell {
    // tslint:disable-next-line:max-line-length
    const localizedNameInSelectedLanguage = getSelectedLanguageFromNamesInAllLanguages(vocabulary.localizedNames, selectedLanguageCode);
    const productTopForTableCell: VocabularyForTableCell = {
      ...vocabulary,
      localizedNameInSelectedLanguage,
    };
    return productTopForTableCell;
  }
}
