import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import {ProductTopTableService} from '../../ProductTop/ProductTopServices/product-top-table.service';
import {ProductTopBackendService} from '../../ProductTop/ProductTopServices/product-top-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import ProductType from '../../ProductTypesAndClasses/productType.entity';
import {ProductTypeTableService} from '../ProductTypeServices/product-type-table.service';
import {ProductTypeBackendService} from '../ProductTypeServices/product-type-backend.service';
import {SearchService} from '../../../helpers/directive/SearchDirective/search.service';
import {GeneralTableService} from '../../../util/GeneralTableService/general-table.service';
import {ProductTypeForTableCell} from '../../ProductTypesAndClasses/productTypeForTableCell';
import OperationModeEnum from '../../../util/OperationModeEnum';

@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.css']
})
export class ProductTypeComponent implements OnInit, AfterContentChecked {
  @Input()
  records: ProductTypeForTableCell[];
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
              public backendService: ProductTypeBackendService,
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
        const recorForTableCell = this.backendService.createProductTypeForTableCellFromProductTop(record);
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
    this.router.navigateByUrl(`/products/types/add?mode=${OperationModeEnum.UPDATE}&recordId=${recordId}`);
  }


  createNewRecord(): void {
    this.router.navigateByUrl(`/products/types/add?mode=${OperationModeEnum.CREATENEW}`);
  }



}
