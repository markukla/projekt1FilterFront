import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import ProductType from '../../Products/ProductTypesAndClasses/productType.entity';
import {ProductTypeTableService} from '../../Products/ProductType/ProductTypeServices/product-type-table.service';
import {ProductTypeBackendService} from '../../Products/ProductType/ProductTypeServices/product-type-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DimensionCodeTableService} from '../DimensionCodeServices/dimension-code-table.service';
import {DimensionCodeBackendService} from '../DimensionCodeServices/dimension-code-backend.service';
import DimensionCode from '../DimensionCodesTypesAnClasses/diemensionCode.entity';
import LocalizedName from '../DimensionCodesTypesAnClasses/localizedName';

@Component({
  selector: 'app-dimension-codes-main',
  templateUrl: './dimension-codes-main.component.html',
  styleUrls: ['./dimension-codes-main.component.css']
})
export class DimensionCodesMainComponent implements OnInit, AfterContentChecked {
  @Input()
  records: DimensionCode[];
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


  constructor(public tableService: DimensionCodeTableService,
              public backendService: DimensionCodeBackendService,
              private router: Router,
              private activedIdParam: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.selectedLanguageLang = 'PL';
    this.getRecords();
    this.materialId = this.tableService.selectedId;
    this.deleteButtonInfo = 'usuń';
    this.updateButtonInfo = 'modyfikuj dane';
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
    });

  }

  deleteSelectedRecord(recordId: number): void {
    this.backendService.deleteRecordById(String(recordId)).subscribe((response) => {
      this.operationStatusMessage = 'Usunięto Materiał z bazy danych';
    }, error => {
      this.operationStatusMessage = 'Wystąpił bład, nie udało się usunąc materiału';
    });
  }

  updateSelectedRecord(recordId: number): void {
    this.tableService.selectedId = recordId;
    this.router.navigateByUrl('/products/types/update');
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

}
