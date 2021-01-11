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
import DimensionTextFIeldInfo from '../../../Products/ProductTypesAndClasses/dimensionTextFIeldInfo';
import {FormGroup} from '@angular/forms';
import {OrderBackendService} from '../OrderServices/order-backend.service';
import {OrderTableService} from '../OrderServices/order-table.service';
import {TableFormServiceService} from '../../../Products/ProductMainComponent/product/product-table-form/table-form-service.service';
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
  tableForm: FormGroup;
  bgImageVariable: string;
  LValue = '';
  DVaLe = '';
  rootUrl = 'http://localhost:5000';
  orderOperationMode: OrderOperationMode;
  createOrderDto: CreateOrderDto;
  selectedOrderId: string;
  allowSubmit = true;
  submitNotAllowedMessage: string;
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
  }

  ngOnInit(): void {
    this.setOrderOperatiomModeAndSelectedOrderBasingOnQueryParamters();

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
      } else if (mode === OrderOperationMode.SHOWDRAWINGCONFIRM) {
        this.orderOperationMode = OrderOperationMode.SHOWDRAWINGCONFIRM;
      } else if (mode === OrderOperationMode.CONFIRMUPDATE) {
        this.orderOperationMode = OrderOperationMode.CONFIRMUPDATE;
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
    } else {
      console.error('in elese block');
      this.createOrderDto = this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing;
      this.bgImageVariable = this.rootUrl + this.createOrderDto.product.urlOfOrginalDrawing;
      this.tableFormService.setInitDataFromDrawingTableFromCreateOrderDto(this.createOrderDto);
      this.tableFormService.enableTableForm();
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
    this.createOrderDto.product.dimensionsTextFieldInfo.forEach((di) => {
      this.createDimensionInputOnDrawingBasingOnDimensionInfo(di, 'input');
    });
  }

  createDimensionInputsForUpdateAndShowDrawingBasingOnProductDataAndOrderData(): void {
    if (this.createOrderDto.product.dimensionsTextFieldInfo) {
      const dimensionsInfo = this.createOrderDto.product.dimensionsTextFieldInfo;
      const dimensions: Dimension [] = this.createOrderDto.orderDetails.dimensions;
      dimensionsInfo.forEach((dimensionInfo) => {
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
    if (this.orderOperationMode === OrderOperationMode.SHOWDRAWING || this.orderOperationMode === OrderOperationMode.SHOWDRAWINGCONFIRM) {
      this.renderer.setAttribute(input, 'readonly', 'true');
      console.error(`input readonly property = ${input.readonly}`);
    }
    else {
      console.error('in else block for readonly');
      this.renderer.setProperty(input, 'readonly', 'false');
      console.error(`input readonly property = ${input.readonly}`);
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
    if (this.orderOperationMode === OrderOperationMode.CREATENEW || this.orderOperationMode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT) {
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
      this.tableFormService.Lvalue = String(event.target.value);
      this.tableFormService.buildIndex();
      this.tableFormService.setOrderName();
    }
    if (allFirstIndexDimensionCodes.includes(event.target.id)) {
      const maxLength = 4;
      if (event.target.value.length > maxLength) {
        event.target.value = event.target.value.slice(0, maxLength);
      }
      this.tableFormService.Dvalue = String(event.target.value);
      this.tableFormService.buildIndex();
      this.tableFormService.setOrderName();
    }
    if (!allSecondIndexDimensionCodes.includes(event.target.id) && !allFirstIndexDimensionCodes.includes(event.target.id)) {
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
    if (this.orderOperationMode === OrderOperationMode.SHOWDRAWING) {
      return true;
    }
    else {
      return false;
    }
  }
}
