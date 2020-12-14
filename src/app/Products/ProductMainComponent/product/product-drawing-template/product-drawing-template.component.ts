import {AfterContentChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ProductBackendService} from '../ProductServices/product-backend.service';
import {ProductTableService} from '../ProductServices/product-table.service';
import Product from '../../../ProductTypesAndClasses/product.entity';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import DimensionTextFIeldInfo from '../../../ProductTypesAndClasses/dimensionTextFIeldInfo';
import {TableFormServiceService} from '../product-table-form/table-form-service.service';

@Component({
  selector: 'app-product-drawing-template',
  templateUrl: './product-drawing-template.component.html',
  styleUrls: ['./product-drawing-template.component.css']
})
export class ProductDrawingTemplateComponent implements OnInit, AfterViewInit, AfterContentChecked {
  productId: string = String(this.tableService.selectedId);
  selectedProduct: Product;
  dimensionsInfo: DimensionTextFIeldInfo[] = [];
  tableForm: FormGroup;
  bgImageVariable: string;
  @ViewChild('drawingContainer', {read: ElementRef}) drawing: ElementRef;

  constructor(private backendService: ProductBackendService,
              private tableService: ProductTableService,
              private renderer: Renderer2,
              private tableFormService: TableFormServiceService
  ) {
    this.getSelectedProductFromDatabase();
  }

  ngOnInit(): void {
    this.tableForm = this.tableFormService.tableForm;
    this.bgImageVariable = this.backendService.drawingPaths.urlOfOrginalDrawing;
    console.log(` this.bgImageVariable= ${this.bgImageVariable}`);
  }
  getSelectedProductFromDatabase(): void {
    this.backendService.findRecordById(this.productId).subscribe((product) => {
      this.selectedProduct = product.body;
      this.dimensionsInfo = product.body.dimensionsTextFieldInfo;
    }, error => {
      console.log(' error: product not loaded from databae');
    });
  }

  createDimensionInputsBasingOnProductData(): void {
    this.dimensionsInfo.forEach((di) => {
      this.createDimensionInputOnDrawingBasingOnDimensionInfo(di, 'input');
    });
  }


  createDimensionInputOnDrawingBasingOnDimensionInfo(dimensionInfo: DimensionTextFIeldInfo, inputTag: string): void {
    const inputId: string = dimensionInfo.dimensionId;
    const inputXposition: string = dimensionInfo.dimensionTexfieldXposition;
    const inputYPosition: string = dimensionInfo.dimensionTexfieldYposition;
    const inputDivClass: string = dimensionInfo.dimensionDivClass;
    const inputClass: string = dimensionInfo.dimensionInputClass;
    const inputDiv = this.renderer.createElement('div');
    const input = this.renderer.createElement(inputTag);
    input.className = inputClass;
    input.value = inputId;
    inputDiv.className = inputDivClass;
    inputDiv.style.left = inputXposition;
    inputDiv.style.top = inputYPosition;
    inputDiv.style.position = 'absolute';
    inputDiv.style.zIndex = 1000;
    this.renderer.appendChild(inputDiv, input);
    this.renderer.appendChild(this.drawing.nativeElement, inputDiv);
  }

  onSubmit(): void {
  }

  ngAfterViewInit(): void {
    this.createDimensionInputsBasingOnProductData();
  }

  ngAfterContentChecked(): void {
    console.log(`workingTemperatureValue= ${this.tableForm.controls.workingTemperature.value}`);
  }
}

