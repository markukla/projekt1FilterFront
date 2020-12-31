import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import Product from '../../../Products/ProductTypesAndClasses/product.entity';
import DimensionTextFIeldInfo from '../../../Products/ProductTypesAndClasses/dimensionTextFIeldInfo';
import {FormGroup} from '@angular/forms';
import {OrderBackendService} from '../OrderServices/order-backend.service';
import {OrderTableService} from '../OrderServices/order-table.service';
import {TableFormServiceService} from '../../../Products/ProductMainComponent/product/product-table-form/table-form-service.service';
import OrderforTableCell from '../../OrdersTypesAndClasses/orderforTableCell';
import User from '../../../Users/users/userTypes/user';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import Dimension from '../../OrdersTypesAndClasses/dimension';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';
import {
  allFirstIndexDimensionCodes,
  allSecondIndexDimensionCodes
} from '../../../Products/ProductTypesAndClasses/alreadyExistingDimensionList';
import OrderDetails from '../../OrdersTypesAndClasses/orderDetail';
import {CreateOrderDto} from '../../OrdersTypesAndClasses/orderDto';
import OrderOperationMode from '../../OrdersTypesAndClasses/orderOperationMode';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-order-drawing',
  templateUrl: './order-drawing.component.html',
  styleUrls: ['./order-drawing.component.css']
})
export class OrderDrawingComponent implements OnInit, AfterViewInit, AfterContentChecked, AfterViewChecked, OnChanges {
  selectedOrderInTableRecord: OrderforTableCell;
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
  data: string;
  orderCreator: User;
  commentToOrder = '';
  rootUrl = 'http://localhost:5000';
  orderOperationMode: OrderOperationMode;
  selectedOrderId: string;
  createOrderDto: CreateOrderDto;
  @ViewChild('drawingContainer', {read: ElementRef}) drawing: ElementRef;

  constructor(
    private orderBackendService: OrderBackendService,
    private orderTableService: OrderTableService,
    private renderer: Renderer2,
    private tableFormService: TableFormServiceService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private host: ElementRef
  ) {
    this.tableForm = this.tableFormService.tableForm;
    this.setOrderOperatiomModeAndSelectedOrderBasingOnQueryParamters();
  }

  ngOnInit(): void {

    // tslint:disable-next-line:max-line-length
  }
  setOrderOperatiomModeAndSelectedOrderBasingOnQueryParamters(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      const mode = queryParams.get('mode');
      console.error(`mode= ${mode}`);
      this.selectedOrderId = queryParams.get('orderId');
      if (mode === OrderOperationMode.CREATENEW) {
        this.orderOperationMode = OrderOperationMode.CREATENEW;
      } else if (mode === OrderOperationMode.UPDATE) {
        this.orderOperationMode = OrderOperationMode.UPDATE;
      } else if (mode === OrderOperationMode.SHOWDRAWING) {
        this.orderOperationMode = OrderOperationMode.SHOWDRAWING;
      } else if (mode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT) {
        this.orderOperationMode = OrderOperationMode.UPDATEWITHCHANGEDPRODUCT;
      } else if (mode === OrderOperationMode.UPDATEDRAWING) {
        this.orderOperationMode = OrderOperationMode.UPDATEDRAWING;
      }
      if (this.orderOperationMode === OrderOperationMode.SHOWDRAWING) {
        this.orderBackendService.findRecordById(this.selectedOrderId).subscribe((order) => {
          this.createOrderDto = this.orderBackendService.getCreateOrderDtoFromOrder(order.body);
          console.error(`this.createOrderDto = ${this.createOrderDto}`);
          this.initPropertiValuesToServicesValues();
          this.setDateInOrderTable();
          this.setOrderNumbersinOrderTable();
          // tslint:disable-next-line:max-line-length
          this.tableFormService.setNonDimensionOrIndexRelateDataForDrawingTable(this.orderTotalNumber, this.orderCreator.fulName, this.data, this.selectedProduct, this.selectedMaterial);
        });
      }
    });
  }
  initPropertiValuesToServicesValues(): void {
    if (this.orderOperationMode === OrderOperationMode.CREATENEW) {
      this.selectedOrderInTableRecord = this.orderTableService.selectedRecord;
      this.selectedProduct = this.orderBackendService.selectedProduct;
      this.bgImageVariable = this.rootUrl + this.selectedProduct.urlOfOrginalDrawing;
      this.selectedPartner = this.orderBackendService.selectedParnter;
      this.selectedMaterial = this.orderBackendService.selectedMaterial;
      this.dimensionsInfo = this.selectedProduct.dimensionsTextFieldInfo;
      this.tableForm = this.tableFormService.tableForm;
      this.orderCreator = this.authenticationService.user;
    }
    // tslint:disable-next-line:max-line-length
    else if ( this.orderOperationMode === OrderOperationMode.SHOWDRAWING) {
      this.orderBackendService.findRecordById(this.selectedOrderId).subscribe((order) => {
        this.createOrderDto = this.orderBackendService.getCreateOrderDtoFromOrder(order.body);
        this.selectedProduct = this.createOrderDto.product;
        this.selectedPartner = this.createOrderDto.businessPartner;
        this.selectedMaterial = this.createOrderDto.productMaterial;
        this.dimensionsInfo = this.createOrderDto.product.dimensionsTextFieldInfo;
        this.tableForm = this.tableFormService.tableForm;
        this.tableFormService.antiEelectrostatic.setValue(this.createOrderDto.orderDetails.antiEelectrostatic);
        this.tableFormService.antiEelectrostatic.disable();
        this.tableFormService.workingSide.setValue(this.createOrderDto.orderDetails.workingSide);
        this.tableFormService.workingSide.disable();
        this.tableFormService.workingTemperature.setValue(this.createOrderDto.orderDetails.workingTemperature);
        this.tableFormService.workingTemperature.disable();
        this.orderCreator = this.createOrderDto.creator;
        this.bgImageVariable = this.rootUrl + this.createOrderDto.product.urlOfOrginalDrawing;
        this.tableFormService.orderName = this.createOrderDto.orderName;
        this.tableFormService.index = this.createOrderDto.index;
      });
    }
    else {
      const createOrderDtoForUpdateOrConfirm = this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing;
      this.tableForm = this.tableFormService.tableForm;
      this.selectedProduct = createOrderDtoForUpdateOrConfirm.product;
      this.selectedPartner = createOrderDtoForUpdateOrConfirm.businessPartner;
      this.selectedMaterial = createOrderDtoForUpdateOrConfirm.productMaterial;
      this.dimensionsInfo = createOrderDtoForUpdateOrConfirm.product.dimensionsTextFieldInfo;
      if (createOrderDtoForUpdateOrConfirm.orderDetails) {
        this.tableFormService.antiEelectrostatic.setValue(createOrderDtoForUpdateOrConfirm.orderDetails.antiEelectrostatic);
        this.tableFormService.antiEelectrostatic.enable();
        this.tableFormService.workingSide.setValue(createOrderDtoForUpdateOrConfirm.orderDetails.workingSide);
        this.tableFormService.workingSide.enable();
        this.tableFormService.workingTemperature.setValue(createOrderDtoForUpdateOrConfirm.orderDetails.workingTemperature);
        this.tableFormService.workingTemperature.enable();
      }
      this.orderCreator = this.authenticationService.user;
      this.bgImageVariable = this.rootUrl + createOrderDtoForUpdateOrConfirm.product.urlOfOrginalDrawing;
      if (this.orderTableService.orderOperationMode !== OrderOperationMode.UPDATEWITHCHANGEDPRODUCT) {
        this.tableFormService.orderName = createOrderDtoForUpdateOrConfirm.orderName;
        this.tableFormService.index = createOrderDtoForUpdateOrConfirm.index;
      }
    }
  }
  setOrderNumbersinOrderTable(): void {
    // tslint:disable-next-line:max-line-length
    if (this.orderTableService.orderOperationMode === OrderOperationMode.CREATENEW) {  // create new mode
      this.orderVersionNumber = this.getCurrentDateAndTimeToBecomeOrderVersionNumber();
      this.orderBackendService.getNewOrderNumber().subscribe((newNumber) => {
        this.orderNumber = newNumber.body.newestNumber;
        this.tableFormService.orderTotalNumber = this.orderNumber + '.' + this.orderVersionNumber;
        this.orderTotalNumber = this.tableFormService.orderTotalNumber;
      }, error => {
        console.log('could not obtain orderNumber For new Order from backend');
      });
      // tslint:disable-next-line:max-line-length
    } else if (this.orderOperationMode === OrderOperationMode.SHOWDRAWING) { // update, confirm, or show disabledDrawing Mode
     /*
     in this version do not build enything just show static drawing
     const createOrderDtoForUpdateOrConfirm = this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing;
      this.orderNumber = createOrderDtoForUpdateOrConfirm.orderNumber;
      this.orderVersionNumber = createOrderDtoForUpdateOrConfirm.orderVersionNumber;
      this.tableFormService.orderTotalNumber = this.orderNumber + '.' + this.orderVersionNumber;
      this.orderTotalNumber = this.tableFormService.orderTotalNumber;
     *  */
    }
    else {
      const createOrderDtoForUpdateOrConfirm = this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing;
      this.orderNumber = createOrderDtoForUpdateOrConfirm.orderNumber;
      this.orderVersionNumber = this.getCurrentDateAndTimeToBecomeOrderVersionNumber();
      this.tableFormService.orderTotalNumber = this.orderNumber + '.' + this.orderVersionNumber;
      this.orderTotalNumber = this.tableFormService.orderTotalNumber;
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
    // tslint:disable-next-line:max-line-length
    if (this.orderTableService.orderOperationMode === OrderOperationMode.CREATENEW || this.orderTableService.orderOperationMode === OrderOperationMode.UPDATE || this.orderTableService.orderOperationMode === OrderOperationMode.UPDATEDRAWING || this.orderTableService.orderOperationMode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT) {
      this.data = new Date().toLocaleDateString();
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

  createDimensionInputsForUpdateAndShowDrawingBasingOnProductDataAndOrderData(createOrderDto: CreateOrderDto): void {
    if (this.dimensionsInfo) {
      const dimensions: Dimension [] = createOrderDto.orderDetails.dimensions;
      this.dimensionsInfo.forEach((dimensionInfo) => {
        dimensions.forEach((dimension) => {
          if (dimensionInfo.dimensionId === dimension.dimensionId) {
            this.createDimensionInputOnDrawingWithSetValueBasingOnDimensionInfoAndOrderData(dimensionInfo, dimension, 'input');
          }
        });
      });
    }
  }

  // tslint:disable-next-line:max-line-length
  createDimensionInputOnDrawingWithSetValueBasingOnDimensionInfoAndOrderData(dimensionInfo: DimensionTextFIeldInfo, dimension: Dimension, inputTag: string): void {
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
    input.value = dimension.dimensionvalue;
    if (allSecondIndexDimensionCodes.includes(input.id)) {
      this.LValue = input.value;
      console.log(`setting Lvalue to = ${this.LValue}`);
    }
    if (allFirstIndexDimensionCodes.includes(input.id)) {
     this.DVaLe = input.value;
    }
    if (this.orderTableService.orderOperationMode === OrderOperationMode.SHOWDRAWING) {
      this.renderer.setAttribute(input, 'readonly', 'true');
    }
    inputDiv.className = inputDivClass;
    inputDiv.style.left = inputXposition;
    inputDiv.style.top = inputYPosition;
    inputDiv.style.position = 'absolute';
    inputDiv.style.zIndex = 1000;

    this.renderer.appendChild(inputDiv, input);
    this.renderer.appendChild(this.drawing.nativeElement, inputDiv);
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
    inputDiv.className = inputDivClass;
    inputDiv.style.left = inputXposition;
    inputDiv.style.top = inputYPosition;
    inputDiv.style.position = 'absolute';
    inputDiv.style.zIndex = 1000;
    this.renderer.appendChild(inputDiv, input);
    this.renderer.appendChild(this.drawing.nativeElement, inputDiv);
  }

  onSubmit(): void {
    // tslint:disable-next-line:max-line-length
    if (this.orderTableService.orderOperationMode === OrderOperationMode.CREATENEW) {
      this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDtoToSaveInDatabase();
      this.orderTableService.orderOperationMode = OrderOperationMode.CONFIRMNEW;
      this.router.navigateByUrl('orders/addOrUpdateOrConfirmOrder');
    }
    else if ( this.orderTableService.orderOperationMode === OrderOperationMode.UPDATE) {
      this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDtoToSaveInDatabase();
      this.orderTableService.orderOperationMode = OrderOperationMode.UPDATE;
      this.router.navigateByUrl('orders/addOrUpdateOrConfirmOrder');
    }
    else if ( this.orderTableService.orderOperationMode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT) {
      this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDtoToSaveInDatabase();
      this.orderTableService.orderOperationMode = OrderOperationMode.UPDATE;
      this.router.navigateByUrl('orders/addOrUpdateOrConfirmOrder');
    }
    else if ( this.orderTableService.orderOperationMode === OrderOperationMode.SHOWDRAWING && this.orderTableService.selectedId) {
      this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDtoToSaveInDatabase();
      this.orderTableService.orderOperationMode = OrderOperationMode.UPDATE;
      this.router.navigateByUrl('orders/addOrUpdateOrConfirmOrder');
    }
    else if ( this.orderTableService.orderOperationMode === OrderOperationMode.SHOWDRAWING && !this.orderTableService.selectedId) {
      this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDtoToSaveInDatabase();
      this.orderTableService.orderOperationMode = OrderOperationMode.CONFIRMNEW;
      this.router.navigateByUrl('orders/addOrUpdateOrConfirmOrder');
    }
    else if ( this.orderTableService.orderOperationMode === OrderOperationMode.UPDATEDRAWING && this.orderTableService.selectedId) {
      this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDtoToSaveInDatabase();
      this.orderTableService.orderOperationMode = OrderOperationMode.UPDATE;
      this.router.navigateByUrl('orders/addOrUpdateOrConfirmOrder');
    }
    else if ( this.orderTableService.orderOperationMode === OrderOperationMode.UPDATEDRAWING && !this.orderTableService.selectedId) {
      this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDtoToSaveInDatabase();
      this.orderTableService.orderOperationMode = OrderOperationMode.CONFIRMNEW;
      this.router.navigateByUrl('orders/addOrUpdateOrConfirmOrder');
    }

  }

  ngAfterViewInit(): void {

  }

  ngAfterContentChecked(): void {
    // tslint:disable-next-line:max-line-length
    const modeDifrentThanCreateNewOrUpdateWithNewProduct = this.orderOperationMode !== OrderOperationMode.CREATENEW && this.orderOperationMode !== OrderOperationMode.UPDATEWITHCHANGEDPRODUCT;
    // tslint:disable-next-line:max-line-length
    if (this.DVaLe.length > 0 && this.LValue.length > 0 && modeDifrentThanCreateNewOrUpdateWithNewProduct) {  /* to allow proper initiation for update or update drawing*/
        this.tableFormService.buildIndex(this.DVaLe, this.LValue);
      }
    else if (!modeDifrentThanCreateNewOrUpdateWithNewProduct && this.orderOperationMode) {
      this.tableFormService.buildIndex(this.DVaLe, this.LValue);
    }

    this.tableFormService.setOrderName();
  }

  ngAfterViewChecked(): void {
    // tslint:disable-next-line:max-line-length
    if (this.orderOperationMode === OrderOperationMode.CREATENEW || this.orderOperationMode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT) {
      this.createDimensionInputsBasingOnProductData();
    }
    else { /* update or show drawing modes*/
      // tslint:disable-next-line:max-line-length
      if (this.createOrderDto !== undefined) {
        this.createDimensionInputsForUpdateAndShowDrawingBasingOnProductDataAndOrderData(this.createOrderDto) ;
      }
    }
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
    if (!allSecondIndexDimensionCodes.includes(event.target.id) && !allFirstIndexDimensionCodes.includes(event.target.id)) {
      const maxLength = 3;
      if (event.target.value.length > maxLength) {
        event.target.value = event.target.value.slice(0, maxLength);
      }
    }

  }

  createOrderDtoToSaveInDatabase(): CreateOrderDto {
    const dimensions: Dimension[] = this.getInputElementsFromVievAndCreateDimensionTable();
    const orderDetails: OrderDetails = {
      antiEelectrostatic: this.tableFormService.antiEelectrostatic.value,
      workingSide: this.tableFormService.workingSide.value,
      workingTemperature: this.tableFormService.workingTemperature.value,
      dimensions
    };
    const orderDtoToSaveInDatabae: CreateOrderDto = {
      data: this.data,
      orderVersionNumber: this.orderVersionNumber,
      orderNumber: this.orderNumber,
      orderTotalNumber: this.orderTotalNumber,
      businessPartner: this.selectedPartner,
      orderName: this.tableFormService.orderName,
      index: this.tableFormService.index,
      creator: this.orderCreator,
      commentToOrder: this.commentToOrder,
      product: this.selectedProduct,
      productMaterial: this.selectedMaterial,
      orderDetails
    };

    return orderDtoToSaveInDatabae;
  }

}
