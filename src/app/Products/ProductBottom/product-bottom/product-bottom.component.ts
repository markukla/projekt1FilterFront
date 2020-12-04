import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import {ProductTopTableService} from '../../ProductTop/ProductTopServices/product-top-table.service';
import {ProductTopBackendService} from '../../ProductTop/ProductTopServices/product-top-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import ProductBottom from '../../ProductTypesAndClasses/productBottom.entity';
import {ProductBottomTableService} from '../ProductBottomServices/product-bottom-table.service';
import {ProductBottomBackendService} from '../ProductBottomServices/product-bottom-backend.service';

@Component({
  selector: 'app-product-bottom',
  templateUrl: './product-bottom.component.html',
  styleUrls: ['./product-bottom.component.css']
})
export class ProductBottomComponent implements OnInit, AfterContentChecked {
  @Input()
  records: ProductBottom[];
  createNewMaterialDescription = 'Dodaj Nowy';
  // tslint:disable-next-line:ban-types
  deleTedMaterialMessage: any;
  operationStatusMessage: string;
  deleteButtonInfo: string;
  updateButtonInfo;
  materialId: number;
  recordNumbers: number;


  constructor(public tableService: ProductBottomTableService,
              public backendService: ProductBottomBackendService,
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
      this.operationStatusMessage = 'Usunięto wykończenie z bazy danych';
    }, error => {
      this.operationStatusMessage = 'Wystąpił bład, nie udało się usunąc wykończenia';
    });
  }

  updateSelectedRecord(materialId: number): void {
    this.tableService.selectedId = materialId;
    this.router.navigateByUrl('/products/bottoms/update');
  }


}
