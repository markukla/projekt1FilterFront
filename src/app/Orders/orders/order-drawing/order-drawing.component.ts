import {AfterContentChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import Product from '../../../Products/ProductTypesAndClasses/product.entity';
import DimensionTextFIeldInfo from '../../../Products/ProductTypesAndClasses/dimensionTextFIeldInfo';
import {FormGroup} from '@angular/forms';
import {ProductBackendService} from '../../../Products/ProductMainComponent/product/ProductServices/product-backend.service';
import {OrderBackendService} from '../OrderServices/order-backend.service';
import {ProductTableService} from '../../../Products/ProductMainComponent/product/ProductServices/product-table.service';
import {OrderTableService} from '../OrderServices/order-table.service';
import {TableFormServiceService} from '../../../Products/ProductMainComponent/product/product-table-form/table-form-service.service';
import OrderforTableCell from '../../OrdersTypesAndClasses/orderforTableCell';
import User from '../../../Users/users/userTypes/user';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import Dimension from '../../OrdersTypesAndClasses/dimension';

@Component({
  selector: 'app-order-drawing',
  templateUrl: './order-drawing.component.html',
  styleUrls: ['./order-drawing.component.css']
})
export class OrderDrawingComponent implements OnInit, AfterViewInit, AfterContentChecked {
  orderId: string = String(this.orderTableService.selectedId);
  selectedOrder: OrderforTableCell;
  selectedOrderEntityId: string;
  selectedProduct: Product = this.orderBackendService.selectedProduct;
  selectedPartner: User = this.orderBackendService.selectedParnter;
  selectedMaterial: Material = this.orderBackendService.selectedMaterial;
  dimensionsInfo: DimensionTextFIeldInfo[] = this.selectedProduct.dimensionsTextFieldInfo;
  tableForm: FormGroup;
  bgImageVariable: string;
  @ViewChild('drawingContainer', {read: ElementRef}) drawing: ElementRef;

  constructor(
              private orderBackendService: OrderBackendService,
              private orderTableService: OrderTableService,
              private renderer: Renderer2,
              private tableFormService: TableFormServiceService,
              private host: ElementRef
  ) {
    this.getSelectedProductFromDatabase();
  }

  ngOnInit(): void {
    this.tableForm = this.tableFormService.tableForm;

    console.log(` this.bgImageVariable= ${this.bgImageVariable}`);
  }
  getSelectedProductFromDatabase(): void {
  }
  buildDataInDrawingTable(): void {
    console.log('in build table form data');
    console.log(`materialName= ${this.selectedMaterial.materialName}`);
    this.tableFormService.material = this.selectedMaterial.materialName;
    console.log(`this.tableFormService.material= ${this.tableFormService.material}`);
    this.tableFormService.orderName = this.selectedProduct.productType.name + '  ' + this.tableFormService.material;
  }
  getInputElementsFromVievAndCreateDimensionTable(): Dimension[] {
    // tslint:disable-next-line:max-line-length
    const inputDivs: HTMLElement[] = this.host.nativeElement.querySelectorAll('.inputDivHorizontal, .inputDivVertical'); /* does not work for 2 class at once selected  */
    const dimensionsForDatabase: Dimension[] = [];
    console.log(`inoutDivs lenhth=   ${inputDivs.length}`);
    for (let i = 0; i < inputDivs.length; i++) {
      /* const inputDivRelativeToContainerXPosition = inputDivs[i].style.left/this.drawing */
      const input: HTMLInputElement = inputDivs[i].getElementsByTagName('input')[0];
      const dimension: Dimension = {
        dimensionId: input.id,
        dimensionvalue: input.value
      };
      dimensionsForDatabase.push(dimension);
    }
    return dimensionsForDatabase;
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
    this.buildDataInDrawingTable();
  }

}
