import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import {ProductTopForTableCell} from '../../Products/ProductTypesAndClasses/productTopForTableCell';
import {Material} from '../../materials/MaterialsMainComponent/material';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';
import {ProductTopBackendService} from '../../Products/ProductTop/ProductTopServices/product-top-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from '../../helpers/directive/SearchDirective/search.service';
import OperationModeEnum from '../../util/OperationModeEnum';
import {VocabularyBackendServiceService} from '../VocabularyServices/vocabulary-backend-service.service';
import {VocabularyForTableCell} from '../VocabularyTypesAndClasses/VocabularyForTableCell';

@Component({
  selector: 'app-vocabulary-main-component',
  templateUrl: './vocabulary-main-component.component.html',
  styleUrls: ['./vocabulary-main-component.component.css']
})
export class VocabularyMainComponentComponent implements OnInit, AfterContentChecked {

  @Input()
  records: VocabularyForTableCell[];
  @Input()
  orginalMaterialsCopy: Material[];
  createNewMaterialDescription = 'Dodaj Nowy';
  // tslint:disable-next-line:ban-types
  deleTedMaterialMessage: any;
  operationStatusMessage: string;
  deleteButtonInfo: string;
  showUpdateForm = false;
  updateButtonInfo;
  materialId: number;
  recordNumbers: number;


  constructor(public tableService: GeneralTableService,
              public backendService: VocabularyBackendServiceService,
              private router: Router,
              private activedIdParam: ActivatedRoute,
              private searChService: SearchService) {
  }
  ngOnInit(): void {
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
      this.tableService.records = [];
      records.body.forEach((record) => {
        const recorForTableCell = this.backendService.createVocabularryForTableCellFromVocabulary(record);
        this.tableService.records.push(recorForTableCell);
      });
      this.records = this.tableService.getRecords();
      this.searChService.orginalArrayCopy = [...this.tableService.getRecords()];
    });

  }

  deleteSelectedRecord(materialId: number): void {
    this.backendService.deleteRecordById(String(materialId)).subscribe((response) => {
      this.operationStatusMessage = 'Usunięto Materiał z bazy danych';
    }, error => {
      this.operationStatusMessage = 'Wystąpił bład, nie udało się usunąc materiału';
    });
  }
  updateSelectedRecord(recordId: number): void {
    this.tableService.selectedId = recordId;
    this.router.navigateByUrl(`/vocabularies/add?mode=${OperationModeEnum.UPDATE}&recordId=${recordId}`);
  }

  createNewRecord(): void {
    this.router.navigateByUrl(`/vocabularies/add?mode=${OperationModeEnum.CREATENEW}`);
  }


}
