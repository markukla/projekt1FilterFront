import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener, Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild, ViewChildren
} from '@angular/core';
import DimensionTextFIeldInfo from '../../../Products/ProductTypesAndClasses/dimensionTextFIeldInfo';
import {FormGroup} from '@angular/forms';
import {OrderBackendService} from '../OrderServices/order-backend.service';
import {OrderTableService} from '../OrderServices/order-table.service';
import {TableFormServiceService} from '../../../Products/ProductMainComponent/product/product-table-form/table-form-service.service';
import Dimension from '../../OrdersTypesAndClasses/dimension';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';

import OrderDetails from '../../OrdersTypesAndClasses/orderDetail';
import {CreateOrderDto} from '../../OrdersTypesAndClasses/orderDto';
import OrderOperationMode from '../../OrdersTypesAndClasses/orderOperationMode';
import {ActivatedRoute, Router} from '@angular/router';
import {DimensionCodeBackendService} from '../../../DimensionCodes/DimensionCodeServices/dimension-code-backend.service';
import {ProductBackendService} from '../../../Products/ProductMainComponent/product/ProductServices/product-backend.service';
import Product from '../../../Products/ProductTypesAndClasses/product.entity';
import LocalizedDimensionCode from '../../../DimensionCodes/DimensionCodesTypesAnClasses/localizedDimensionCode';
import DimensionCode from '../../../DimensionCodes/DimensionCodesTypesAnClasses/diemensionCode.entity';
import DimensionRoleEnum from '../../../DimensionCodes/DimensionCodesTypesAnClasses/dimensionRoleEnum';

@Component({
  selector: 'app-order-drawing',
  templateUrl: './order-drawing.component.html',
  styleUrls: ['./order-drawing.component.css']
})
export class OrderDrawingComponent implements OnInit, AfterViewInit, AfterContentChecked, AfterViewChecked, OnChanges {
  tableForm: FormGroup;
  bgImageVariable: string;
  LValue = '';
  DVaLe = '';
  rootUrl = 'http://localhost:5000';
  orderOperationMode: OrderOperationMode;
  createOrderDto: CreateOrderDto;
  selectedOrderId: string;
  selectedProductId: string;
  allowSubmit = true;
  submitNotAllowedMessage: string;
  firstIndexDimensions: string[] = [];
  secondIndexDimensions: string[] = [];
  /* below fields moved from create-product drawing component*/
  createDimensionForm: FormGroup;
  dimensionRoleForm: FormGroup;
  operationFailerStatusMessage: string;
  operationSuccessStatusMessage: string;
  allDimensionCodes: LocalizedDimensionCode [];
  allFirstIndexDimensionCodes: LocalizedDimensionCode[];
  allSecondIndexDimensionCOde: LocalizedDimensionCode [];
  allNonIndexDimensionCodes: LocalizedDimensionCode [];
  selectedLanguageLang: string = 'PL'; /* it will be the value obtained form login service in the future*/
  addNewClicked = false;
  idValue: string;
  angle = -90;
  newDimension: DimensionCode;
  newLocalizedDimension: LocalizedDimensionCode;
  // tslint:disable-next-line:max-line-length
  /* view child is a get elementby id equivalent, and Viev childrens is something like get element by class name, but element must be marked with #elementname*/
  dimensionRoleFirstIndexDimensionDescription = 'Pierwszy Wymiar Indeksu';
  dimensionRoleFirstIndex: DimensionRoleEnum = DimensionRoleEnum.FIRSTINDEXDIMENSION;
  dimensionRoleSecondIndexDimensionDescription = 'Drugi wymiar Indeksu';
  dimensionRoleSecondIndex: DimensionRoleEnum = DimensionRoleEnum.SECONDINDEXDIMENSION;
  dimensionRoleNoIndexDimensionDescription = 'Wymiar nie wchodzący do indeksu';
  dimensionRoleNoIndex: DimensionRoleEnum = DimensionRoleEnum.NOINDEXDIMENSION;

  @ViewChild('drawingContainer', {read: ElementRef}) drawing: ElementRef;
  @ViewChildren('.inputDivHorizontal', {read: HTMLElement}) inputDivs: HTMLElement[];
  constructor(
    private orderBackendService: OrderBackendService,
    private orderTableService: OrderTableService,
    private renderer: Renderer2,
    private productBackendService: ProductBackendService,
    private tableFormService: TableFormServiceService,
    private authenticationService: AuthenticationService,
    private dimensionCodeService: DimensionCodeBackendService,
    private router: Router,
    private route: ActivatedRoute,
    private host: ElementRef
  ) {
    this.tableForm = this.tableFormService.tableForm;
  }

  async ngOnInit(): Promise<void> {
    this.setOrderOperatiomModeAndSelectedOrderBasingOnQueryParamters();
    await this.getDimensionCodes();

    // tslint:disable-next-line:max-line-length
  }
  async getDimensionCodes(): Promise<void> {
    const firstIndexDimension = await this.dimensionCodeService.getFirstIndexDimensions().toPromise();
    const secondIndeXDimensions = await this.dimensionCodeService.getSecondIndexDimensions().toPromise();
    firstIndexDimension.body.forEach((firstDimension) => {
      this.firstIndexDimensions.push(firstDimension.dimensionCode);
    });
    secondIndeXDimensions.body.forEach((secondDimension) => {
      this.secondIndexDimensions.push(secondDimension.dimensionCode);
    });
  }

   setOrderOperatiomModeAndSelectedOrderBasingOnQueryParamters(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      const mode = queryParams.get('mode');
      console.error(`mode= ${mode}`);
      this.selectedOrderId = queryParams.get('orderId');
      this.selectedProductId = queryParams.get('productId');
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
      } else if (mode === OrderOperationMode.SHOWDRAWINGCONFIRM) {
        this.orderOperationMode = OrderOperationMode.SHOWDRAWINGCONFIRM;
      } else if (mode === OrderOperationMode.CONFIRMUPDATE) {
        this.orderOperationMode = OrderOperationMode.CONFIRMUPDATE;
      }
      else if (mode === OrderOperationMode.SHOWPRODUCT) {
        this.orderOperationMode = OrderOperationMode.SHOWPRODUCT;
      }
      else if (mode === OrderOperationMode.UPDATEPRODUCT) {
        this.orderOperationMode = OrderOperationMode.UPDATEPRODUCT;
      }
      this.initPropertiValuesToServicesValues();
    });
  }

  initPropertiValuesToServicesValues(): void {
    this.tableForm = this.tableFormService.tableForm;
    // tslint:disable-next-line:max-line-length
    if (this.orderOperationMode === OrderOperationMode.SHOWDRAWING) {
      this.orderBackendService.findRecordById(this.selectedOrderId).subscribe((order) => {
        this.createOrderDto = this.orderBackendService.getCreateOrderDtoFromOrder(order.body);
        this.bgImageVariable = this.rootUrl + this.createOrderDto.product.urlOfOrginalDrawing;
        this.tableFormService.setInitDataFromDrawingTableFromCreateOrderDto(this.createOrderDto);
        this.tableFormService.disableTableForm();
      });
    } else if (this.orderOperationMode === OrderOperationMode.SHOWDRAWINGCONFIRM) {
      console.error(`in show drawing confirm method`);
      this.createOrderDto = this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing;
      this.bgImageVariable = this.rootUrl + this.createOrderDto.product.urlOfOrginalDrawing;
      this.tableFormService.setInitDataFromDrawingTableFromCreateOrderDto(this.createOrderDto);
      this.tableFormService.disableTableForm();
    }
    else if (this.orderOperationMode === OrderOperationMode.SHOWPRODUCT) {
      this.productBackendService.findRecordById(this.selectedProductId).subscribe((product)=> {
        const foundproduct: Product = product.body;
        this.createOrderDto = {
          orderNumber: null,
          product: foundproduct,
          orderDetails: null,
          orderName: null,
          index: null,
          orderTotalNumber: null,
          orderVersionNumber: null,
          businessPartner: null,
          commentToOrder: null,
          productMaterial: null,
          creator: null,
          date: null
        };
        this.bgImageVariable = this.rootUrl + this.createOrderDto.product.urlOfOrginalDrawing;
        this.tableFormService.setInitDataFromDrawingTableFromCreateOrderDto(this.createOrderDto);
        this.tableFormService.disableTableForm();
      });
    }
    else if (this.orderOperationMode === OrderOperationMode.UPDATEPRODUCT || this.orderOperationMode === OrderOperationMode.CREATENEWPRODUCT) {
      this.createOrderDto = this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing;
      this.bgImageVariable = this.rootUrl + this.createOrderDto.product.urlOfOrginalDrawing;
      this.tableFormService.setInitDataFromDrawingTableFromCreateOrderDto(this.createOrderDto);
      this.tableFormService.disableTableForm();
    }
    else {
      console.error('in elese block');
      this.createOrderDto = this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing;
      this.bgImageVariable = this.rootUrl + this.createOrderDto.product.urlOfOrginalDrawing;
      this.tableFormService.setInitDataFromDrawingTableFromCreateOrderDto(this.createOrderDto);
      this.tableFormService.enableTableForm();
    }
  }


  getInputElementsFromVievAndCreateDimensionTable(): Dimension[] {
    // tslint:disable-next-line:max-line-length
    const inputs: HTMLTextAreaElement [] = this.host.nativeElement.querySelectorAll('.dimensionInputHorizontal'); /* does not work for 2 class at once selected  */
    const dimensionsForDatabase: Dimension[] = [];
    inputs.forEach((input) => {
      const dimension: Dimension = {
        dimensionvalue: input.value,
        dimensionId: input.id
      };
      dimensionsForDatabase.push(dimension);
    });
    return dimensionsForDatabase;
  }


  createDimensionInputsBasingOnProductData(): void {
    this.createOrderDto.product.dimensionsTextFieldInfo.forEach((di) => {
      this.createDimensionInputOnDrawingBasingOnDimensionInfo(di, 'textarea');
    });
  }

  createDimensionInputsForUpdateAndShowDrawingBasingOnProductDataAndOrderData(): void {
    if (this.createOrderDto.product.dimensionsTextFieldInfo) {
      const dimensionsInfo = this.createOrderDto.product.dimensionsTextFieldInfo;
      const dimensions: Dimension [] = this.createOrderDto.orderDetails.dimensions;
      dimensionsInfo.forEach((dimensionInfo) => {
        dimensions.forEach((dimension) => {
          if (dimensionInfo.dimensionId === dimension.dimensionId) {
            this.createDimensionInputOnDrawingWithSetValueBasingOnDimensionInfoAndOrderData(dimensionInfo, dimension, 'textarea');
          }
        });
      });
    }
  }

  // tslint:disable-next-line:max-line-length
  createDimensionInputOnDrawingWithSetValueBasingOnDimensionInfoAndOrderData(dimensionInfo: DimensionTextFIeldInfo, dimension: Dimension, inputTag: string): void {
    const input = this.renderer.createElement(inputTag);
    input.value = dimension.dimensionvalue;
    this.setInputPositionAndSeizeBazingOnDatabaseData(dimensionInfo, input);
    if (this.secondIndexDimensions.includes(input.id)) {
      this.LValue = input.value;
      console.log(`setting Lvalue to = ${this.LValue}`);
    }
    if (this.firstIndexDimensions.includes(input.id)) {
      this.DVaLe = input.value;
    }
    if (this.orderOperationMode === OrderOperationMode.SHOWDRAWING || this.orderOperationMode === OrderOperationMode.SHOWDRAWINGCONFIRM) {
      this.renderer.setAttribute(input, 'readonly', 'true');
      console.error(`input readonly property = ${input.readonly}`);
    }
    else {
      console.error('in else block for readonly');
      this.renderer.setProperty(input, 'readonly', 'false');
      console.error(`input readonly property = ${input.readonly}`);
    }
    this.renderer.appendChild(this.drawing.nativeElement, input);
  }


  createDimensionInputOnDrawingBasingOnDimensionInfo(dimensionInfo: DimensionTextFIeldInfo, inputTag: string): void {
    const input = this.renderer.createElement(inputTag);
   // input.type = 'number';
    this.setInputPositionAndSeizeBazingOnDatabaseData(dimensionInfo, input);
    this.renderer.appendChild(this.drawing.nativeElement, input);
  }
  setInputPositionAndSeizeBazingOnDatabaseData(dimensionInfo: DimensionTextFIeldInfo, input: HTMLElement): void {
    if (dimensionInfo.transform) {
      input.style.transform = dimensionInfo.transform;
    }
    if (dimensionInfo.dimensionTexFieldWidth) {
      input.style.width = dimensionInfo.dimensionTexFieldWidth;
    }
    if (dimensionInfo.dimensionTexFieldHeight) {
      input.style.height = dimensionInfo.dimensionTexFieldHeight;
    }
    input.style.left = dimensionInfo.dimensionTexfieldXposition;
    input.style.top = dimensionInfo.dimensionTexfieldYposition;
    input.className = dimensionInfo.dimensionInputClass;
    input.id = dimensionInfo.dimensionId;
    input.style.position = 'absolute';
    input.style.zIndex = '1000';
    input.style.resize = 'none';
    if (this.orderOperationMode === OrderOperationMode.SHOWDRAWING || this.orderOperationMode === OrderOperationMode.SHOWDRAWINGCONFIRM) {
      input.style.border = 'none';
    }
  }

  onSubmit(): void {
    this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDtoToSaveInDatabase();
    this.checkIfAllFieldsValidInCreateOrderDto( this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing);
    // tslint:disable-next-line:max-line-length
    if (this.allowSubmit === true) {
    if (this.orderOperationMode === OrderOperationMode.CREATENEW && this.allowSubmit === true) {
      this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?mode=${OrderOperationMode.CONFIRMNEW}`);
    } else if (this.orderOperationMode === OrderOperationMode.UPDATE && this.allowSubmit === true) {
      // tslint:disable-next-line:max-line-length
      this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?orderId=${this.selectedOrderId}&mode=${OrderOperationMode.CONFIRMUPDATE}`);
    } else if (this.orderOperationMode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT) {
      // tslint:disable-next-line:max-line-length
      this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?orderId=${this.selectedOrderId}&mode=${OrderOperationMode.CONFIRMUPDATE}`);
    } else if (this.orderTableService.orderOperationMode === OrderOperationMode.SHOWDRAWING) {
     // this.location.back(); how to go back ? !!!!
    } else if (this.orderOperationMode === OrderOperationMode.SHOWDRAWINGCONFIRM && this.selectedOrderId) {
      // tslint:disable-next-line:max-line-length
      this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?orderId=${this.selectedOrderId}&mode=${OrderOperationMode.CONFIRMUPDATE}`);
    }
    else if (this.orderOperationMode === OrderOperationMode.SHOWDRAWINGCONFIRM && !this.selectedOrderId) {
      this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDtoToSaveInDatabase();
      this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?mode=${OrderOperationMode.CONFIRMNEW}`);
    }else if (this.orderOperationMode === OrderOperationMode.UPDATEDRAWING && this.selectedOrderId ) {
      this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDtoToSaveInDatabase();
      // tslint:disable-next-line:max-line-length
      this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?orderId=${this.selectedOrderId}&mode=${OrderOperationMode.CONFIRMUPDATE}`);
    } else if (this.orderOperationMode === OrderOperationMode.UPDATEDRAWING && !this.selectedOrderId) {
      this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDtoToSaveInDatabase();
      this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?mode=${OrderOperationMode.CONFIRMNEW}`);
    }
    }
    else {
      console.error(this.submitNotAllowedMessage);
    }

  }
  ngAfterViewInit(): void {
    // tslint:disable-next-line:max-line-length
    if (this.orderOperationMode === OrderOperationMode.CREATENEW || this.orderOperationMode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT || this.orderOperationMode === OrderOperationMode.UPDATEPRODUCT) {
      this.createDimensionInputsBasingOnProductData();
    } else { /* update or show drawing modes*/
      // tslint:disable-next-line:max-line-length
      if (this.createOrderDto !== undefined) {
        this.createDimensionInputsForUpdateAndShowDrawingBasingOnProductDataAndOrderData();
      }
    }
  }

  ngAfterContentChecked(): void {
  }

  ngAfterViewChecked(): void {
    if (this.createOrderDto !== undefined && this.orderOperationMode === OrderOperationMode.SHOWDRAWING) {
      this.createDimensionInputsForUpdateAndShowDrawingBasingOnProductDataAndOrderData();
    }
    else if (this.createOrderDto !== undefined && this.orderOperationMode === OrderOperationMode.SHOWPRODUCT) {
      this.createDimensionInputsBasingOnProductData();
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  @HostListener('input', ['$event'])
  bindInputWithIndex(event: any): void {
    const inputId = event.target.id;
    if (this.secondIndexDimensions.includes(event.target.id)) {
      const maxLength = 5;
      if (event.target.value.length > maxLength) {
        event.target.value = event.target.value.slice(0, maxLength);
      }
      this.tableFormService.Lvalue = String(event.target.value);
      this.tableFormService.buildIndex();
      this.tableFormService.setOrderName();
    }
    if (this.firstIndexDimensions.includes(event.target.id)) {
      const maxLength = 4;
      if (event.target.value.length > maxLength) {
        event.target.value = event.target.value.slice(0, maxLength);
      }
      this.tableFormService.Dvalue = String(event.target.value);
      this.tableFormService.buildIndex();
      this.tableFormService.setOrderName();
    }
    if (!this.secondIndexDimensions.includes(event.target.id) && !this.firstIndexDimensions.includes(event.target.id)) {
      const maxLength = 3;
      if (event.target.value.length > maxLength) {
        event.target.value = event.target.value.slice(0, maxLength);
      }
    }

  }
  createOrderDtoToSaveInDatabase(): CreateOrderDto {
    const dimensions = this.getInputElementsFromVievAndCreateDimensionTable();
    const orderDetails: OrderDetails = {
      antiEelectrostatic: this.tableFormService.antiEelectrostatic.value,
      workingSide: this.tableFormService.workingSide.value,
      workingTemperature: this.tableFormService.workingTemperature.value,
      dimensions
    };
    const orderDtoToSaveInDatabae: CreateOrderDto = {
      ...this.createOrderDto,
      orderName: this.tableFormService.orderName,
      index: this.tableFormService.index,
      orderDetails
    };

    return orderDtoToSaveInDatabae;
  }
  checkIfAllFieldsValidInCreateOrderDto(createOrderDto: CreateOrderDto): void {
    this.submitNotAllowedMessage = '';
    this.allowSubmit = true;
    const dimensions: Dimension[] = createOrderDto.orderDetails.dimensions;
    dimensions.forEach((dimension) => {
      if (!dimension.dimensionvalue) {
        this.allowSubmit = false;
        this.submitNotAllowedMessage = 'Prosze podać wartości wszystkich wymiarów';
      }
    });
    if (!this.tableFormService.workingTemperature.value) {
      this.allowSubmit = false;
      this.submitNotAllowedMessage = this.submitNotAllowedMessage + '  , Prosze podać wartość temperatury pracy';
    }
    if (!this.tableFormService.workingSide.value) {
      this.allowSubmit = false;
      this.submitNotAllowedMessage = this.submitNotAllowedMessage + '  , Prosze zaznaczyć stronę pracującą';
    }
    if (this.allowSubmit === false) {
      window.alert(this.submitNotAllowedMessage);
    }

  }
  async getDrawingPdf(): Promise<void> {
    console.error(`this.router.url= ${this.router.url}`);
    console.error(`window.location.href= ${window.location.href}`);
    const pdfTodownLoad = await this.orderBackendService.getDrawingPdf(window.location.href).toPromise();
    const newBlob = new Blob([pdfTodownLoad], {type: 'application/pdf'});

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    }
    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement('a');
    link.href = data;
    link.download = 'file.pdf';
    link.click();
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
    }, 100);
  }

  checkIfShowDrawingMode(): boolean {
    if (this.orderOperationMode === OrderOperationMode.SHOWDRAWING || this.orderOperationMode === OrderOperationMode.SHOWPRODUCT) {
      return true;
    }
    else {
      return false;
    }
  }

  /* below all methods moved from create-product-drawing*/

}
