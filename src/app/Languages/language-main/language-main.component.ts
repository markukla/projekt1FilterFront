import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import DimensionCode from '../../DimensionCodes/DimensionCodesTypesAnClasses/diemensionCode.entity';
import {DimensionCodeTableService} from '../../DimensionCodes/DimensionCodeServices/dimension-code-table.service';
import {DimensionCodeBackendService} from '../../DimensionCodes/DimensionCodeServices/dimension-code-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import {SearchService} from '../../helpers/directive/SearchDirective/search.service';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';
import {LanguageBackendService} from '../languageServices/language-backend.service';
import Language from '../LanguageTypesAndClasses/languageEntity';
import {API_URL} from '../../Config/apiUrl';

@Component({
  selector: 'app-language-main',
  templateUrl: './language-main.component.html',
  styleUrls: ['./language-main.component.css']
})
export class LanguageMainComponent implements OnInit, AfterContentChecked {
  @Input()
  records: Language[];
  createNewMaterialDescription = 'Dodaj Nowy';
  // tslint:disable-next-line:ban-types
  deleTedRecordMessage: any;
  operationStatusMessage: string;
  deleteButtonInfo: string;
  showUpdateForm = false;
  updateButtonInfo;
  materialId: number;
  selectedLanguageLang: string;
  recordNumbers: number;
  langs: string[] = ['PL', 'CZE', 'EN']; // it will be obtained from database
  languageCodeDescription: string;
  languageNameDescription: string;
  languageActiveDescription: string;
  tableColumnDescriptions: string[];


  constructor(public tableService: GeneralTableService,
              public backendService: LanguageBackendService,
              private router: Router,
              private searChService: SearchService,
              private activedIdParam: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.selectedLanguageLang = 'PL';
    this.getRecords();
    this.initColumnAndMessageDescriptionForSelectedLanguage();
    this.materialId = this.tableService.selectedId;
    this.deleteButtonInfo = 'usuń';
    this.updateButtonInfo = 'modyfikuj dane';
  }
  initColumnAndMessageDescriptionForSelectedLanguage (): void {
    this.tableColumnDescriptions = [];
    this.languageCodeDescription = 'Kod Języka';
    this.languageNameDescription = 'Nazwa Języka';
    this.languageActiveDescription = ' aktywny';
    this.tableColumnDescriptions.push(this.languageCodeDescription, this.languageNameDescription, this.languageActiveDescription);
  }
  ngAfterContentChecked(): void {
    if (this.records) {
      this.recordNumbers = this.records.length;
    }
  }
  getRecords(): void {
    this.backendService.getRecords().subscribe((records) => {
      this.tableService.records.length = 0;
      this.tableService.records = records.body;
      this.records = this.tableService.getRecords();
      this.searChService.orginalArrayCopy = [...this.tableService.getRecords()];
    });

  }

  deleteSelectedRecord(recordId: number): void {
    this.backendService.deleteRecordById(String(recordId)).subscribe((response) => {
      this.operationStatusMessage = 'Usunięto rekord z bazy danych';
    }, error => {
      this.operationStatusMessage = 'Wystąpił bład, nie udało się usunąc wybranego rekordu z bazy danych';
    });
  }

  updateSelectedRecord(recordId: number): void {
    this.tableService.selectedId = recordId;
    this.router.navigateByUrl(`/languages/create?mode=update&languageId=${recordId}`);
  }

  getSelectedLanguageFromNamesInAllLanguages(localizedNames: LocalizedName[], selectedLanguageLang: string): string {
    const localizedNameInGivenLanguage: LocalizedName[] = [];
    localizedNames.forEach((localizedName) => {
      if (localizedName.languageCode === selectedLanguageLang) {
        localizedNameInGivenLanguage.push(localizedName);
      }
    });
    return localizedNameInGivenLanguage[0].nameInThisLanguage;
  }


  createNewRecord(): void {
    this.router.navigateByUrl(`/languages/create?mode=createNew`);
  }
  getFlagUrl(language: Language): string {
    const flagUlr = API_URL + language.flagUrl;
    return flagUlr;

  }
}
