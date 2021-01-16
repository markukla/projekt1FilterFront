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
  ViewChild,
  ViewChildren
} from '@angular/core';
import DimensionTextFIeldInfo from '../../../Products/ProductTypesAndClasses/dimensionTextFIeldInfo';
import {FormControl, FormGroup, Validators} from '@angular/forms';
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
import CreateProductDto from '../../../Products/ProductTypesAndClasses/product.dto';
import {getBackendErrrorMesage} from '../../../helpers/errorHandlingFucntion/handleBackendError';

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
  createProductDto: CreateProductDto;
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
    private dimensionBackendService: DimensionCodeBackendService,
    private router: Router,
    private route: ActivatedRoute,
    private host: ElementRef
  ) {
    this.tableForm = this.tableFormService.tableForm;
  }

  async ngOnInit(): Promise<void> {
    this.createDimensionForm = new FormGroup({
      dimensionCodeControll: new FormControl(null, [Validators.required]),
    });
    this.dimensionRoleForm = new FormGroup({
      dimensionRole: new FormControl(null, [Validators.required]),
    });
    await this.getPreviouslyUsedCodes();
    this.setOrderOperatiomModeAndSelectedOrderBasingOnQueryParamters();
    await this.getDimensionCodes();

    // tslint:disable-next-line:max-line-length
  }
  async getDimensionCodes(): Promise<void> {
    const firstIndexDimension = await this.dimensionBackendService.getFirstIndexDimensions().toPromise();
    const secondIndeXDimensions = await this.dimensionBackendService.getSecondIndexDimensions().toPromise();
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
      else if (mode === OrderOperationMode.CREATENEWPRODUCT) {
        this.orderOperationMode = OrderOperationMode.CREATENEWPRODUCT;
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
      this.createProductDto = this.productBackendService.createProductDto;
      this.bgImageVariable = this.rootUrl + this.createProductDto.urlOfOrginalDrawing;
      this.tableFormService.setInitDataFromDrawingTableFromCreateOrderDto(null, this.createProductDto);
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
  // tslint:disable-next-line:typedef
  get dimensionRole() {
    return this.dimensionRoleForm.get('dimensionRole');
  }
  // tslint:disable-next-line:typedef
  get dimensionCodeControll() {
    return this.createDimensionForm.get('dimensionCodeControll');
  }

  // tslint:disable-next-line:typedef


  // tslint:disable-next-line:typedef


  onSubmitForInputCreating(): void {
    this.setIdValue();
    const input = this.renderer.createElement('textarea');
    this.renderer.setProperty(input, 'value', this.idValue);
    this.renderer.setProperty(input, 'id', this.idValue);
    // this.renderer.setProperty(input, 'type', 'number');
    console.log(`inputId= ${input.id}`);
    input.className = 'dimensionInputHorizontal';
    input.style.overflow = 'auto';
    input.style.resize = 'both';
    /* const drawing = document.getElementById('drawingContainer'); */
    this.renderer.appendChild(this.drawing.nativeElement, input);
    this.makeInputDivDragable(input);
    this.rotateTextField(input);


  }

  rotateTextField(textField): void {

    textField.addEventListener('dblclick', () => {

      console.log(this.angle);
      textField.style.transform = `rotate(${this.angle}deg)`;
      if (this.angle === -90) {
        this.angle = 90;
      }
      else if (this.angle === 90) {
        this.angle = 0;
      }
      else {
        this.angle = -90;
      }
      /*  it is always horizontal, because rotation means that horizontal dimension become also vertical*/
      textField.style.resize = 'horizontal';
    });
  }

  makeInputDivDragable(input: HTMLElement): void {

    let dragable = true;

    input.addEventListener('contextmenu', (ev) => {

      ev.preventDefault();
      if (dragable === true) {
        dragable = false;
      } else if (dragable === false) {
        dragable = true;
      }
    });


    input.onmousedown = (event) => {

      console.log(`event.type= ${event.type}`);
      console.log(`textfield.style.transform= ${input.style.transform}`);
      console.log(`textfield.style.width= ${input.style.width}`);
      console.log(`textfield.style.height= ${input.style.height}`);
      const texfieldWith = document.getElementById(input.id).style.width;
      console.log(`texfieldWith= ${texfieldWith}`);
      if (dragable === true && event.type !== 'dblclick') {
        // event.clientX and event.clientY are mouse pointer coordinates
        //  textField.getBoundingClientRect().left distance from left corner to html.element
        const transform = input.style.transform;
        const inputWidth = input.style.width;
        const inputWidthNumber = Number(inputWidth.split('px')[0]);
        const inputHeight = input.style.height;
        const inputHeightNumber = Number(inputHeight.split('px')[0]);
        const widthMinusHeightDevidedBy2 = (inputWidthNumber - inputHeightNumber) / 2;
        let shiftX: number;
        let shiftY: number;
        if (!transform || transform === '') {
          shiftX = event.clientX - input.getBoundingClientRect().left;
          shiftY = event.clientY - input.getBoundingClientRect().top;
        }
        else if (transform && (transform === 'rotate(-90deg)' || transform === 'rotate(90deg)')) {
          shiftX = event.clientX - input.getBoundingClientRect().left + widthMinusHeightDevidedBy2;
          shiftY = event.clientY - input.getBoundingClientRect().top - widthMinusHeightDevidedBy2;
        }

        input.style.position = 'absolute';
        input.style.zIndex = '1000';
        this.renderer.appendChild(this.drawing.nativeElement, input);
        const moveAt = (pageX, pageY) => {
          const textFieldWidth = input.style.width;
          const textFieldHeight = input.getBoundingClientRect().height;
          console.log(textFieldHeight);
          input.style.left = pageX - shiftX + 'px';
          input.style.top = pageY - shiftY + 'px';

          /*
          widght=60, height=20 widght-height= 40, widght-height/2 = 20 which is correction value
           textField.style.left = pageX - shiftX - 20  + 'px';
          textField.style.top = pageY - shiftY + 20 + 'px';*/
        };
        moveAt(event.pageX, event.pageY);

        // moves the ball at (pageX, pageY) coordinates
        // taking initial shifts into account
        const onMouseMove = (event: any) => {
          moveAt(event.pageX, event.pageY);
        };

        // move the ball on mousemove
        document.addEventListener('mousemove', onMouseMove);

        // drop the ball, remove unneeded handlers
        document.onmouseup = () => {
          document.removeEventListener('mousemove', onMouseMove);
          input.onmouseup = null;
        };

      }
      input.ondragstart = () => {
        return false;
      };
    };
  }
  saveProductInDatabas(): void {

    const dimensionFieldInfoTable: DimensionTextFIeldInfo[] = this.getTextFieldsPositionsAndIdAndPushItToTable();
    const createProductDto: CreateProductDto = {
      ... this.createProductDto,
      dimensionsTextFieldInfo: dimensionFieldInfoTable
    };
    this.productBackendService.addRecords(createProductDto).subscribe((product) => {
      console.log('dodano nowy Product');
      this.operationSuccessStatusMessage = 'dodano nowy Product';
    }, (error) => {
      const errorMessage = getBackendErrrorMesage(error);
      if (errorMessage.includes('Already exist in database')) {
        this.operationFailerStatusMessage = 'nie udało się dodać produktu, produkt o podanych parametrach już istnieje w bazie danych';
      } else {
        this.operationFailerStatusMessage = 'wystąpił bład, nie udało sie dodać produktu, spróbuj ponownie';
      }
    });


  }

  getTextFieldsPositionsAndIdAndPushItToTable(): DimensionTextFIeldInfo[] {

    const dimensionsTextFieldInfoTable: DimensionTextFIeldInfo[] = [];
    // tslint:disable-next-line:max-line-length
    const inputDivs: HTMLElement[] = this.host.nativeElement.querySelectorAll('.dimensionInputHorizontal');
    for (let i = 0; i < inputDivs.length; i++) {
      /* const inputDivRelativeToContainerXPosition = inputDivs[i].style.left/this.drawing */
      const dimensionTextFIeldInfo: DimensionTextFIeldInfo = {
        dimensionId: inputDivs[i].id,
        dimensionTexfieldXposition: `${inputDivs[i].style.left}`,
        dimensionTexfieldYposition: `${inputDivs[i].style.top}`,
        dimensionTexFieldHeight: `${inputDivs[i].style.height}`,
        dimensionTexFieldWidth: `${inputDivs[i].style.width}`,
        dimensionInputClass: inputDivs[i].className,
        transform: `${inputDivs[i].style.transform}`,
      };
      dimensionsTextFieldInfoTable.push(dimensionTextFIeldInfo);
    }
    return dimensionsTextFieldInfoTable;
  }

  async getPreviouslyUsedCodes(): Promise<void> {
    try {
      const allDimensions = await this.dimensionBackendService.getRecords().toPromise();
      this.allDimensionCodes = this.getLocalizedNameFromAllLanguage(allDimensions.body);

    }
    catch (error: any) {
      console.log('could not get all dimensions');
    }
    try {
      const allFirstIndexDimensions = await this.dimensionBackendService.getFirstIndexDimensions().toPromise();
      this.allFirstIndexDimensionCodes = this.getLocalizedNameFromAllLanguage(allFirstIndexDimensions.body);

    }
    catch (error: any) {
      console.log('could not get allFirstIndexDimensions');
    }
    try {
      const secondIndexDimensions = await this.dimensionBackendService.getSecondIndexDimensions().toPromise();
      this.allSecondIndexDimensionCOde = this.getLocalizedNameFromAllLanguage(secondIndexDimensions.body);

    }
    catch (error: any) {
      console.log('could not get secondIndexDimensions');
    }
    try {
      const noIndexDimensions = await this.dimensionBackendService.getNonIndexDimensions().toPromise();
      this.allNonIndexDimensionCodes = this.getLocalizedNameFromAllLanguage(noIndexDimensions.body);

    }
    catch (error: any) {
      console.log('could not get noIndexDimensions');
    }
  }

  setIdValue(): void {
    console.error(`this.createDimensionForm =${this.createDimensionForm}`);
    if (this.dimensionCodeControll.value) {

      this.idValue = this.dimensionCodeControll.value;
    }
  }
  getLocalizedNameFromAllLanguage(dimensnionCodes: DimensionCode[]): LocalizedDimensionCode[] {
    const localizedDimensionCodes: LocalizedDimensionCode[] = [];
    dimensnionCodes.forEach((dimensionCOde) => {
      dimensionCOde.localizedDimensionNames.forEach((localizedName) => {
        if (localizedName.languageCode === this.selectedLanguageLang) {
          const localizedCode: LocalizedDimensionCode = {
            ...dimensionCOde,
            localizedDimensionName: localizedName
          };
          localizedDimensionCodes.push(localizedCode);
        }
      });
    });
    return localizedDimensionCodes;
  }
  getLocalizedDimensionFromDimension(dimension: DimensionCode): LocalizedDimensionCode {
    let localizedDimensionCode: LocalizedDimensionCode;
    dimension.localizedDimensionNames.forEach((localizedName) => {
      if (localizedName.languageCode === this.selectedLanguageLang) {
        localizedDimensionCode = {
          ...dimension,
          localizedDimensionName: localizedName
        };
      }
    });
    return localizedDimensionCode;
  }

  onNewProductCreated(event: DimensionCode): void {
    console.log('in on product created');
    this.newDimension = event;
    this.addNewClicked = false;

  }


  createOrUpdateProductMode(): boolean {
    if (this.orderOperationMode === OrderOperationMode.UPDATEPRODUCT || this.orderOperationMode === OrderOperationMode.CREATENEWPRODUCT) {
      return true;
    }
    else {
      return false;
    }
  }
}
