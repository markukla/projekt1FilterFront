import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef, HostListener,
  OnChanges,
  OnInit,
  Renderer2, SimpleChanges,
  ViewChild
} from '@angular/core';
import Product from '../../../Products/ProductTypesAndClasses/product.entity';
import DimensionTextFIeldInfo from '../../../Products/ProductTypesAndClasses/dimensionTextFIeldInfo';
import {FormControl, FormGroup} from '@angular/forms';
import {ProductBackendService} from '../../../Products/ProductMainComponent/product/ProductServices/product-backend.service';
import {OrderBackendService} from '../OrderServices/order-backend.service';
import {ProductTableService} from '../../../Products/ProductMainComponent/product/ProductServices/product-table.service';
import {OrderTableService} from '../OrderServices/order-table.service';
import {TableFormServiceService} from '../../../Products/ProductMainComponent/product/product-table-form/table-form-service.service';
import OrderforTableCell from '../../OrdersTypesAndClasses/orderforTableCell';
import User from '../../../Users/users/userTypes/user';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import Dimension from '../../OrdersTypesAndClasses/dimension';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';
import {allUsedDimensionsCodes} from '../../../Products/ProductTypesAndClasses/alreadyExistingDimensionList';
import {allSecondIndexDimensionCodes} from '../../../Products/ProductTypesAndClasses/alreadyExistingDimensionList';
import {allFirstIndexDimensionCodes} from '../../../Products/ProductTypesAndClasses/alreadyExistingDimensionList';
import Order from '../../OrdersTypesAndClasses/orderEntity';

@Component({
  selector: 'app-order-drawing',
  templateUrl: './order-drawing.component.html',
  styleUrls: ['./order-drawing.component.css']
})
export class OrderDrawingComponent implements OnInit, AfterViewInit, AfterContentChecked, AfterViewChecked, OnChanges {
  orderId: string = String(this.orderTableService.selectedId);
  selectedOrderInTableRecord: OrderforTableCell;
  selectedOrderEntity: Order;
  selectedOrderEntityId: string;
  selectedProduct: Product;
  selectedPartner: User;
  selectedMaterial: Material;
  dimensionsInfo: DimensionTextFIeldInfo[];
  tableForm: FormGroup;
  bgImageVariable: string;
  LValue = '';
  DVaLe = '';
  orderNumber: number;  // it is not id because it is the same for orders with the same order version register
  orderVersionNumber: string;
  orderTotalNumber: string;
  data: Date|string;
  orderCreator: string;

  @ViewChild('drawingContainer', {read: ElementRef}) drawing: ElementRef;

  constructor(
              private orderBackendService: OrderBackendService,
              private orderTableService: OrderTableService,
              private renderer: Renderer2,
              private tableFormService: TableFormServiceService,
              private authenticationService: AuthenticationService,
              private host: ElementRef
  ) {
   this.getOrderEnityFromBackendForSelectedTableOrder();
   this.setOrderNumbersinOrderTable();
  }
  ngOnInit(): void {
    this.initPropertiValuesToServicesValues();
    this.setDateInOrderTable();
    this.setOrderNumbersinOrderTable();
    // tslint:disable-next-line:max-line-length
    this.tableFormService.setNonDimensionOrIndexRelateDataForDrawingTable(this.orderTotalNumber, this.orderCreator, this.data, this.selectedProduct, this.selectedMaterial);
  }
  initPropertiValuesToServicesValues(): void {
    this.selectedOrderInTableRecord = this.orderTableService.selectedRecord;
    this.selectedProduct = this.orderBackendService.selectedProduct;
    this.selectedPartner = this.orderBackendService.selectedParnter;
    this.selectedMaterial = this.orderBackendService.selectedMaterial;
    this.dimensionsInfo = this.selectedProduct.dimensionsTextFieldInfo;
    this.tableForm = this.tableFormService.tableForm;
    this.orderCreator = this.authenticationService.user.fulName;
  }
  getOrderEnityFromBackendForSelectedTableOrder(): void {
    if (this.selectedOrderInTableRecord) {
      this.orderBackendService.findRecordById(String(this.selectedOrderInTableRecord.id)).subscribe((order) => {
        this.selectedOrderEntity = order.body;
      }, error => {
        console.log('nie udało się pobrać danych zapytania na podstawie wybranego rekordu w tabeli');
      });
    }
  }
  setOrderNumbersinOrderTable(): void {
    if (this.selectedOrderEntity) {  // update mode
      this.orderNumber = this.selectedOrderEntity.orderNumber;
      this.orderVersionNumber = this.selectedOrderEntity.orderVersionNumber;
      this.tableFormService.orderTotalNumber = this.orderNumber + '.' + this.orderVersionNumber;
      this.orderTotalNumber = this.tableFormService.orderTotalNumber;
    }
    else { // create new order mode
      this.orderVersionNumber = this.getCurrentDateAndTimeToBecomeOrderVersionNumber();
      this.orderBackendService.getNewOrderNumber().subscribe((newNumber) => {
        this.orderNumber = newNumber.body.newestNumber;
        this.tableFormService.orderTotalNumber = this.orderNumber + '.' + this.orderVersionNumber;
        this.orderTotalNumber = this.tableFormService.orderTotalNumber;
      }, error => {
        console.log('could not obtain orderNumber For new Order from backend');
      });
    }
  }
   private getCurrentDateAndTimeToBecomeOrderVersionNumber(): string {
    const now = new Date();
    const date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    const time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    const dateAndTimeNow = date + '.' + time;
    return dateAndTimeNow;

  }
  private setDateInOrderTable(): void {
    if (this.selectedOrderEntity){
      this.data = this.selectedOrderEntity.data;
    }
    else {
      this.data = new Date();
    }
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
    input.type = 'number';
    input.id = inputId;
    if (input.id === 'L'){
      console.log(' in set maxlength for L');
     // this.renderer.setAttribute(input, 'max', '99999');
      // console.log(`input maxlength set to: ${input.maxLength}`);
    }
    if (input.id === 'D'){
     // this.renderer.setAttribute(input, 'max', '9999');
    }
    if (input.id !== 'D' && input.id !== 'L') {
     // this.renderer.setAttribute(input, 'max', '999');
    }
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
    console.log(`this. this.tableFormService.index= ${ this.tableFormService.index}`);
    this.tableFormService.buildIndex(this.DVaLe, this.LValue);
    this.tableFormService.setOrderName();
  }

  ngAfterViewChecked(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
  @HostListener('input', ['$event'])
  bindInputWithIndex(event: any): void {
    const inputId = event.target.id;
    if (allSecondIndexDimensionCodes.includes(event.target.id)) {
      const maxLength = 5;
      if (event.target.value.length > maxLength) {
        event.target.value = event.target.value.slice(0, maxLength);
      }
      this.LValue = String(event.target.value);
    }
    if (allFirstIndexDimensionCodes.includes(event.target.id)) {
      const maxLength = 4;
      if (event.target.value.length > maxLength) {
        event.target.value = event.target.value.slice(0, maxLength);
      }
      this.DVaLe = String(event.target.value);
    }
    if (!allSecondIndexDimensionCodes.includes(event.target.id) && !allFirstIndexDimensionCodes.includes(event.target.id) ) {
      const maxLength = 3;
      if (event.target.value.length > maxLength) {
        event.target.value = event.target.value.slice(0, maxLength);
      }
    }

  }
}
