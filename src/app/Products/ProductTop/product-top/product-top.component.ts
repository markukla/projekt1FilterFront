import {AfterContentChecked, Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import {MaterialTableService} from '../../../materials/MaterialServices/material-table.service';
import {MaterialBackendService} from '../../../materials/MaterialServices/material-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductTopTableService} from '../ProductTopServices/product-top-table.service';
import {ProductTopBackendService} from '../ProductTopServices/product-top-backend.service';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';

@Component({
  selector: 'app-product-top',
  templateUrl: './product-top.component.html',
  styleUrls: ['./product-top.component.css']
})
export class ProductTopComponent implements OnInit, AfterContentChecked {
  @Input()
  records: ProductTop[];
  @Input()
  orginalMaterialsCopy: Material[];
  createNewMaterialDescription = 'Create new Material';
  // tslint:disable-next-line:ban-types
  deleTedMaterialMessage: any;
  operationStatusMessage: string;
  deleteButtonInfo: string;
  showUpdateForm = false;
  updateButtonInfo;
  materialId: number;
  recordNumbers: number;


  constructor(public tableService: ProductTopTableService,
              public backendService: ProductTopBackendService,
              private router: Router,
              private activedIdParam: ActivatedRoute) {
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
      this.tableService.records = records.body;
      this.records = this.tableService.getRecords();
    });

  }

  deleteSelectedRecord(materialId: number): void {
    this.backendService.deleteRecordById(String(materialId)).subscribe((response) => {
      this.operationStatusMessage = 'Usunięto Materiał z bazy danych';
    }, error => {
      this.operationStatusMessage = 'Wystąpił bład, nie udało się usunąc materiału';
    });
  }

  updateSelectedRecord(materialId: number): void {
    this.tableService.selectedId = materialId;
    this.router.navigateByUrl('/products/tops/update');
  }

}
