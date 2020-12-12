import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import ProductType from '../../ProductTypesAndClasses/productType.entity';
import {ProductTypeTableService} from '../../ProductType/ProductTypeServices/product-type-table.service';
import {ProductTypeBackendService} from '../../ProductType/ProductTypeServices/product-type-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import Product from '../../ProductTypesAndClasses/product.entity';
import {ProductTableService} from './ProductServices/product-table.service';
import {ProductBackendService} from './ProductServices/product-backend.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterContentChecked {

  @Input()
  records: Product[];
  createNewMaterialDescription = 'Dodaj Nowy';
  // tslint:disable-next-line:ban-types
  deleTedMaterialMessage: any;
  operationStatusMessage: string;
  deleteButtonInfo: string;
  showUpdateForm = false;
  updateButtonInfo;
  materialId: number;
  recordNumbers: number;


  constructor(public tableService: ProductTableService,
              public backendService: ProductBackendService,
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
    this.router.navigateByUrl('/products/update');
  }


  showDrawing(id: number): void {
    this.tableService.selectedId = id;
    this.router.navigateByUrl('/products/productDrawingBlueprint');
  }
}
