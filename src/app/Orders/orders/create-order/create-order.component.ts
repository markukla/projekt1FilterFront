import {AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';
import ProductBottom from '../../../Products/ProductTypesAndClasses/productBottom.entity';
import ProductTop from '../../../Products/ProductTypesAndClasses/productTop.entity';
import ProductType from '../../../Products/ProductTypesAndClasses/productType.entity';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DrawingPaths} from '../../../Products/ProductTypesAndClasses/drawingPaths';
import {ProductBackendService} from '../../../Products/ProductMainComponent/product/ProductServices/product-backend.service';
import {ProductValidatorService} from '../../../Products/ProductMainComponent/product/ProductServices/product-validator.service';
import {ProductTypeBackendService} from '../../../Products/ProductType/ProductTypeServices/product-type-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import User from '../../../Users/users/userTypes/user';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import {MaterialBackendService} from '../../../materials/MaterialServices/material-backend.service';
import {BusinesPartnerBackendService} from '../../../BusinessPartners/business-partners/BusinessPartnerServices/busines-partner-backend.service';
import {OrderBackendService} from '../OrderServices/order-backend.service';
import CreateProductDto from '../../../Products/ProductTypesAndClasses/product.dto';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';
import RoleEnum from '../../../Users/users/userTypes/roleEnum';
import OrderOperationMode from '../../OrdersTypesAndClasses/orderOperationMode';
import {OrderTableService} from '../OrderServices/order-table.service';
import {CreateOrderDto} from '../../OrdersTypesAndClasses/orderDto';
import Product from '../../../Products/ProductTypesAndClasses/product.entity';
import {TableFormServiceService} from '../../../Products/ProductMainComponent/product/product-table-form/table-form-service.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit, AfterContentChecked, AfterViewInit, AfterViewChecked {

  operationMessage: string;
  showoperationStatusMessage: string;
  allBotomsToselect: ProductBottom[];
  allTopsToSelect: ProductTop[];
  allTypesToSelect: ProductType[];
  allParntersToSelect: User[];
  allMaterialsToSelect: Material[];
  selectedtType: ProductType;
  selectedTop: ProductTop;
  selectedBottom: ProductBottom;
  selectedProduct: Product;
  selectedMaterial: Material;
  selectedPartner: User;
  form: FormGroup;
  drawingPaths: DrawingPaths;
  isPartner: boolean;
  orderOperationMode: OrderOperationMode;
  createOrderDto: CreateOrderDto;
  confirmOrCHangePartnerButtonInfo: string;
  partnerConfirmed: boolean;
  confirmOrCHangeProductParmatersButtonInfo: string;
  productConfirmed: boolean;
  confirmOrCHangeMaterialButtonInfo: string;
  materialConfirmed: boolean;
  onSubmitButtonInfo: string;
  operationModeEqualConfirmNewOrUpdate: boolean;
  updateModeOrPartnerLogged: boolean;
  submitButtonDescription: string;
  productHasBeenChanged: boolean;
  allowSubmit = false;
  newOrderNumber: number;  // it is not id because it is the same for orders with the same order version register
  newOrderVersionNumber: string;
  newOrderTotalNumber: string;
  newData: string;
  selctedIdForUpdateOrShowDrawing: string;

  constructor(
    private backendService: OrderBackendService,
    private tableFormService: TableFormServiceService,
    private host: ElementRef,
    private renderer: Renderer2,
    private orderTableService: OrderTableService,
    private productBackendService: ProductBackendService,
    public validationService: ProductValidatorService,
    private typesBackendService: ProductTypeBackendService,
    private materialBackendService: MaterialBackendService,
    private partnersBackendService: BusinesPartnerBackendService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.productHasBeenChanged = false;
    this.isPartner = this.authenticationService.userRole === RoleEnum.PARTNER;
    this.getDataToDropdownLists();
    this.form = new FormGroup({
      type: new FormControl(null, [Validators.required]),
      top: new FormControl(null, [Validators.required]),
      bottom: new FormControl(null, [Validators.required]),
      businessPartner: new FormControl(null, Validators.required),
      productMaterial: new FormControl(null, Validators.required)
    }, {updateOn: 'change'});
    await this.setOrderOperatiomModeBasingOnQueryParamtersAndInitPropertyValues();
  }

   async setOrderOperatiomModeBasingOnQueryParamtersAndInitPropertyValues(): Promise<void> {
    this.route.queryParamMap.subscribe(async queryParams => {
      const mode = queryParams.get('mode');
      const orderId = queryParams.get('orderId');
      this.selctedIdForUpdateOrShowDrawing = orderId;
      if (mode === OrderOperationMode.CREATENEW ) {
        this.orderOperationMode = OrderOperationMode.CREATENEW;
        this.setInitStateofConfirmOrCHangeButtonsAndSubmitButton();
        this.setOrderNumbersinOrderTableForNewOrder();
      } else if (mode === OrderOperationMode.UPDATE || mode === OrderOperationMode.SHOWDRAWING) {
        if (mode === OrderOperationMode.UPDATE) {
          this.orderOperationMode = OrderOperationMode.UPDATE;
        }
        else if (mode === OrderOperationMode.SHOWDRAWING) {
          this.orderOperationMode = OrderOperationMode.SHOWDRAWING;
        }
        const selectedOrder = await this.backendService.findRecordById(orderId).toPromise();
        this.createOrderDto = this.backendService.getCreateOrderDtoFromOrder(selectedOrder.body);
        this.setInitStateofConfirmOrCHangeButtonsAndSubmitButton();
        this.setFormControlValuesForUpdateOrShowDrawingMode(this.createOrderDto);
        // tslint:disable-next-line:max-line-length
      } else if (mode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT || mode === OrderOperationMode.CONFIRMUPDATE || OrderOperationMode.UPDATEDRAWING || mode === OrderOperationMode.CONFIRMNEW || OrderOperationMode.SHOWDRAWINGCONFIRM) {
        if (mode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT) {
          this.orderOperationMode = OrderOperationMode.UPDATEWITHCHANGEDPRODUCT;
        } else if (mode === OrderOperationMode.UPDATEDRAWING) {
          this.orderOperationMode = OrderOperationMode.UPDATEDRAWING;
        } else if (mode === OrderOperationMode.CONFIRMUPDATE) {
          this.orderOperationMode = OrderOperationMode.CONFIRMUPDATE;
        } else if (mode === OrderOperationMode.CONFIRMNEW) {
          this.orderOperationMode = OrderOperationMode.CONFIRMNEW;
        } else if (mode === OrderOperationMode.SHOWDRAWINGCONFIRM) {
          this.orderOperationMode = OrderOperationMode.SHOWDRAWINGCONFIRM;
        }
        this.createOrderDto = this.backendService.createOrderDtoForConfirmUpdateShowDrawing;
        this.setFormControlValuesForUpdateOrShowDrawingMode(this.createOrderDto);
        this.setInitStateofConfirmOrCHangeButtonsAndSubmitButton();
      }
    });
  }

setFormControlValuesForUpdateOrShowDrawingMode(createOrderDto: CreateOrderDto): void {
    if (createOrderDto) {
      console.error('in setFormControlValuesForUpdateOrShowDrawingMode');
      this.businessPartner.setValue(this.createOrderDto.businessPartner);
      this.productMaterial.setValue(this.createOrderDto.productMaterial);
      this.selectedMaterial = this.productMaterial.value;
      this.selectedPartner = this.businessPartner.value;
      this.type.setValue(this.createOrderDto.product.productType);
      this.selectedtType = this.type.value;
      this.top.setValue(this.createOrderDto.product.productTop);
      this.selectedTop = this.top.value;
      this.bottom.setValue(this.createOrderDto.product.productBottom);
      this.selectedBottom = this.bottom.value;
    }
  }

setInitStateofConfirmOrCHangeButtonsAndSubmitButton(): void {
    if (this.orderOperationMode === OrderOperationMode.CREATENEW) {
      this.submitButtonDescription = 'dalej';
      this.materialConfirmed = false;
      this.productConfirmed = false;
      this.partnerConfirmed = false;
      this.confirmOrCHangeProductParmatersButtonInfo = 'zatwierdź parametry produktu';
      this.confirmOrCHangeMaterialButtonInfo = 'zatwierdź materiał worka';
      this.confirmOrCHangePartnerButtonInfo = 'zatwierdż partnera handlowego';
      this.onSubmitButtonInfo = 'dalej';
    }
    // tslint:disable-next-line:max-line-length
    else if (this.orderOperationMode === OrderOperationMode.CONFIRMNEW) {
      this.submitButtonDescription = 'złóż zapytanie';
      this.materialConfirmed = true;
      this.productConfirmed = true;
      this.partnerConfirmed = true;
      this.onSubmitButtonInfo = 'złóż zapytanie';
      this.confirmOrCHangeProductParmatersButtonInfo = 'zmień parametry produktu';
      this.confirmOrCHangeMaterialButtonInfo = 'zmień materiał worka';
      this.confirmOrCHangePartnerButtonInfo = 'zmień partnera handlowego';
    } else if (this.orderTableService.orderOperationMode === OrderOperationMode.UPDATE) {
      this.submitButtonDescription = 'aktualizuj zapytanie';
      this.materialConfirmed = true;
      this.productConfirmed = true;
      this.partnerConfirmed = true;
      this.onSubmitButtonInfo = 'złóż zapytanie';
      this.confirmOrCHangeProductParmatersButtonInfo = 'zmień parametry produktu';
      this.confirmOrCHangeMaterialButtonInfo = 'zmień materiał worka';
      this.confirmOrCHangePartnerButtonInfo = 'zmień partnera handlowego';
    }
  }

setFormControlValueForConfirmMode(): void {
    if (this.backendService.createOrderDtoForConfirmUpdateShowDrawing) {
      const createOrderDto: CreateOrderDto = this.backendService.createOrderDtoForConfirmUpdateShowDrawing;
      this.type.setValue(createOrderDto.product.productType);
      this.selectedtType = this.type.value;
      this.top.setValue(createOrderDto.product.productTop);
      this.selectedTop = this.top.value;
      this.bottom.setValue(createOrderDto.product.productBottom);
      this.selectedBottom = this.bottom.value;
      this.businessPartner.setValue(createOrderDto.businessPartner);
      this.selectedPartner = createOrderDto.businessPartner;
      this.productMaterial.setValue(createOrderDto.productMaterial);
      this.selectedMaterial = createOrderDto.productMaterial;
    }
  }

  // tslint:disable-next-line:typedef
get type() {
    return this.form.get('type');
  }

// tslint:disable-next-line:typedef
get top() {
    return this.form.get('top');
  }

  // tslint:disable-next-line:typedef
get bottom() {
    return this.form.get('bottom');
  }

  // tslint:disable-next-line:typedef
get businessPartner() {
    return this.form.get('businessPartner');
  }

  // tslint:disable-next-line:typedef
get productMaterial() {
    return this.form.get('productMaterial');
  }

getDataToDropdownLists(): void {
    this.typesBackendService.getRecords().subscribe((records) => {
      this.allTypesToSelect = records.body;
    }, error => {
      console.log('error during requesting productTypes from db');
    });
    if (this.isPartner === false) { } {
      this.partnersBackendService.getAllRecords().subscribe((records) => {
        this.allParntersToSelect = records.body;
      }, error => {
        console.log('error during requesting partners from db');
      });
    }
    this.materialBackendService.getRecords().subscribe((records) => {
      this.allMaterialsToSelect = records.body;
    }, error => {
      console.log('error during requesting materials from db');
    });
  }

setTopsAndBottomsToSelectAfterTypeSelected(productType: ProductType): void {
    this.allTopsToSelect = productType.topsForThisProductType;
    this.allBotomsToselect = productType.bottomsForThisProductType;
  }

onSubmit(): void {
    console.error('in on Submit method');
    // tslint:disable-next-line:max-line-length
    if (this.orderOperationMode === OrderOperationMode.CREATENEW) {
      let partnerToCreateOrderDto: User;
      if (!this.isPartner) {
        partnerToCreateOrderDto = this.selectedPartner;
      } else if (this.isPartner) {
        partnerToCreateOrderDto = this.authenticationService.user;
      }
      this.backendService.selectedMaterial = this.selectedMaterial;
      const createProductDto: CreateProductDto = {
        productType: this.selectedtType,
        productBottom: this.selectedBottom,
        productTop: this.selectedTop
      };
      this.productBackendService.getProductByTypeTopBottom(createProductDto).subscribe((product) => {
        this.selectedProduct = product.body;
        const createOrderDto: CreateOrderDto = {
          businessPartner: this.selectedPartner,
          index: null,
          orderName: null,
          commentToOrder: null,
          orderVersionNumber: this.newOrderTotalNumber,
          product: this.selectedProduct,
          productMaterial: this.selectedMaterial,
          orderTotalNumber: this.newOrderTotalNumber,
          data: this.setDateInOrderTable(),
          orderNumber: this.newOrderNumber,
          creator: this.authenticationService.user,
          orderDetails: null,
        };
        this.backendService.createOrderDtoForConfirmUpdateShowDrawing = createOrderDto;
        this.router.navigateByUrl(`/orders/drawing?mode=${OrderOperationMode.CREATENEW}`);
      }, error => {
        console.log('nie udało się znaleźć produktu na postawie wybranych parametrów');
        this.operationMessage = 'nie udało się znaleźć produktu na postawie wybranych parametrów. Spróbuj ponownie';
      });
      // tslint:disable-next-line:max-line-length
    } else if (this.orderOperationMode === OrderOperationMode.CONFIRMNEW) {
      // tslint:disable-next-line:max-line-length
      this.createOrderDto.businessPartner = this.selectedPartner;
      this.createOrderDto.productMaterial = this.selectedMaterial;
      this.tableFormService.setNonDimensionOrIndexRelateDataForDrawingTable(this.createOrderDto);
      this.tableFormService.setOrderName();
      this.createOrderDto.orderName = this.tableFormService.orderName;
      this.backendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDto;
      this.backendService.addRecords(this.createOrderDto).subscribe((order) => {
          this.operationMessage = 'dodano nowe zamówienie';
        },
        error => {
          this.operationMessage = 'nie udało się dodać nowego zamówienia';

        });
    } else if (this.orderOperationMode === OrderOperationMode.UPDATE && this.productHasBeenChanged === false) {

      // tslint:disable-next-line:max-line-length
      const updateOrderDto: CreateOrderDto = {
        ...this.backendService.createOrderDtoForConfirmUpdateShowDrawing,
        productMaterial: this.selectedMaterial,
      };
      // tslint:disable-next-line:max-line-length
      this.backendService.updateRecordById(String(this.selctedIdForUpdateOrShowDrawing), updateOrderDto).subscribe((order) => {
          this.operationMessage = 'zaktualizowano zamówinie';
        },
        error => {
          this.operationMessage = 'nie udało się zaktualizować zamówienia';
        });
    } else if (this.orderOperationMode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT) {
      let selectedPartnerToDto: User;
      if (!this.isPartner) {
        selectedPartnerToDto = this.selectedPartner;
      } else if (this.isPartner) {
        selectedPartnerToDto = this.authenticationService.user;
      }
      const createProductDto: CreateProductDto = {
        productType: this.selectedtType,
        productBottom: this.selectedBottom,
        productTop: this.selectedTop
      };
      this.productBackendService.getProductByTypeTopBottom(createProductDto).subscribe((product) => {
        this.selectedProduct = product.body;
        this.setOrderNumbersinOrderTableForUpdateModes();
        this.tableFormService.setNonDimensionOrIndexRelateDataForDrawingTable(this.createOrderDto);
        this.tableFormService.setOrderName();
        this.createOrderDto.orderName = this.tableFormService.orderName;
        this.createOrderDto.orderNumber = this.newOrderNumber;
        this.createOrderDto.orderTotalNumber = this.newOrderTotalNumber;
        this.createOrderDto.data = this.setDateInOrderTable();
        const createOrderDtoWithCHangedProduct: CreateOrderDto = {
          ...this.createOrderDto,
          product: this.selectedProduct,
          businessPartner: selectedPartnerToDto,
          productMaterial: this.selectedMaterial,
          orderDetails: null,
        };
        this.backendService.createOrderDtoForConfirmUpdateShowDrawing = {
          ...createOrderDtoWithCHangedProduct
        };
        this.router.navigateByUrl(`/orders/drawing?mode=${OrderOperationMode.UPDATEWITHCHANGEDPRODUCT}`);
      }, error => {
        console.log('nie udało się znaleźć produktu na postawie wybranych parametrów');
        this.operationMessage = 'nie udało się znaleźć produktu na postawie wybranych parametrów. Spróbuj ponownie';
      });
    }
  }

closeAndGoBack(): void {
    this.router.navigateByUrl('/orders');
  }

cleanOperationMessage(): void {
    setTimeout(() => {
      this.showoperationStatusMessage = null;
    }, 2000 );
  }

changeModeTOCreateNewIfrProductChangedInUpdateOrCOnfirmMode(): void {
    // tslint:disable-next-line:max-line-length
    if (this.orderOperationMode === OrderOperationMode.UPDATE || this.orderOperationMode === OrderOperationMode.CONFIRMNEW) { } {
      // tslint:disable-next-line:max-line-length
      const productMaterialOrPartnerHastBeenCHanged: boolean = this.productConfirmed === false;
      if (productMaterialOrPartnerHastBeenCHanged) {
        this.orderOperationMode = OrderOperationMode.CREATENEW;
      }
    }
  }

ngAfterContentChecked(): void {
    this.checkOperationMode();
    this.setUpdateModeOrPartnerLoggedValue();
    this.onTypeSelectedSetTopsAndBottoms();
    this.setAllowSubmit();
    // this.changeModeTOCreateNewIfPartnerProductOrMaterialChangedInUpdateOrCOnfirmMode();
  }

setUpdateModeOrPartnerLoggedValue(): void {
    if (this.isPartner || this.orderOperationMode === OrderOperationMode.UPDATE) {
      this.updateModeOrPartnerLogged = true;
    } else {
      this.updateModeOrPartnerLogged = false;
    }
  }

onTypeSelectedSetTopsAndBottoms(): void {
    const type = this.type.value;
    console.log(`selected type= ${type}`);
    if (type) {
      this.setTopsAndBottomsToSelectAfterTypeSelected(type);
    }
  }

changeOrConfirmPartnerButtonAction(): void {
    if (this.partnerConfirmed === false && this.businessPartner.value) {
      this.selectedPartner = this.businessPartner.value;
      this.businessPartner.disable({onlySelf: true});
      this.confirmOrCHangePartnerButtonInfo = 'Zmień Partnera Handlowego';
      if (this.backendService.createOrderDtoForConfirmUpdateShowDrawing) {
        this.backendService.createOrderDtoForConfirmUpdateShowDrawing.businessPartner = this.selectedPartner;
      }
      this.partnerConfirmed = true;
    } else if (this.partnerConfirmed === true && this.businessPartner) {
      this.businessPartner.enable({onlySelf: true});
      this.confirmOrCHangePartnerButtonInfo = 'Zatwierdż Partnera Handlowego';
      this.partnerConfirmed = false;
    }


  }

confirmOrchangeProductButtonAction(): void {
    if (this.productConfirmed === false && this.type.value && this.top.value && this.bottom.value) {
      console.log('in confirmOrCHangeProductButtonMethod');
      this.selectedtType = this.type.value;
      this.type.disable({onlySelf: true});
      this.selectedTop = this.top.value;
      this.top.disable({onlySelf: true});
      this.selectedBottom = this.bottom.value;
      this.bottom.disable({onlySelf: true});
      this.confirmOrCHangeProductParmatersButtonInfo = 'Zmień parametry produktu';
      this.productConfirmed = true;
    } else if (this.productConfirmed === true) {
      this.type.enable({onlySelf: true});
      this.top.enable({onlySelf: true});
      this.bottom.enable({onlySelf: true});
      this.confirmOrCHangeProductParmatersButtonInfo = 'Zatwierdź parametry produktu';
      this.businessPartner.enable({onlySelf: true});
      this.productConfirmed = false;
    }

  }

confirmOrChangeMaterialButtonAction(): void {
    if (this.materialConfirmed === false) {
      this.productMaterial.disable({onlySelf: true});
      this.confirmOrCHangeMaterialButtonInfo = 'Zmień materiał';
      this.selectedMaterial = this.productMaterial.value;
      if (this.backendService.createOrderDtoForConfirmUpdateShowDrawing) {
        this.backendService.createOrderDtoForConfirmUpdateShowDrawing.productMaterial = this.selectedMaterial;
      }
      this.materialConfirmed = true;
    } else if (this.materialConfirmed === true) {
      this.productMaterial.enable({onlySelf: true});
      this.confirmOrCHangeMaterialButtonInfo = 'Zatwierdż materiał';
      this.materialConfirmed = false;
    }

  }

ngAfterViewInit(): void {
    /*   if (this.orderOperationMode === OrderOperationMode.UPDATE) {
      if (!this.productConfirmed) {
        this.setInitStateofConfirmOrCHangeButtonsAndSubmitButton();
      }
      if (!this.selectedMaterial && this.createOrderDto) {
        this.setFormControlValuesForUpdateOrShowDrawingMode (this.createOrderDto);
      }
    }  */
  }

ngAfterViewChecked(): void {
  }

checkOperationMode(): void {
    // tslint:disable-next-line:max-line-length
    if (this.orderOperationMode === OrderOperationMode.CONFIRMNEW || OrderOperationMode.UPDATE || OrderOperationMode.CONFIRMUPDATE) {
      this.operationModeEqualConfirmNewOrUpdate = true;
    } else {
      this.operationModeEqualConfirmNewOrUpdate = false;
    }
  }

seeDrawing(): void {
    this.router.navigateByUrl(`orders/drawing?mode=${OrderOperationMode.SHOWDRAWINGCONFIRM}`);
  }

updateDrawing(): void {
    this.router.navigateByUrl(`orders/drawing?mode=${OrderOperationMode.UPDATEDRAWING}`);
  }

setAllowSubmit(): void {
    if (this.isPartner === true) {
      if (this.productConfirmed === true && this.materialConfirmed === true) {
        this.allowSubmit = true;
      } else {
        this.allowSubmit = false;
      }
    } else {
      if (this.productConfirmed === true && this.materialConfirmed === true && this.partnerConfirmed === true) {
        this.allowSubmit = true;
      } else {
        this.allowSubmit = false;
      }
    }
  }
setOrderNumbersinOrderTableForNewOrder(): void {
    // tslint:disable-next-line:max-line-length
    if (this.orderOperationMode === OrderOperationMode.CREATENEW) {  // create new mode
      this.newOrderVersionNumber = this.getCurrentDateAndTimeToBecomeOrderVersionNumber();
      this.backendService.getNewOrderNumber().subscribe((newNumber) => {
        this.newOrderNumber = newNumber.body.newestNumber;
        this.newOrderTotalNumber = this.newOrderNumber + '.' + this.newOrderVersionNumber;
        this.newOrderTotalNumber = this.tableFormService.orderTotalNumber;
      }, error => {
        console.log('could not obtain newOrderNumber For new Order from backend');
      });
      // tslint:disable-next-line:max-line-length
  }
  }
setOrderNumbersinOrderTableForUpdateModes(): void {
    if (this.orderOperationMode !== OrderOperationMode.SHOWDRAWING && this.orderOperationMode !== OrderOperationMode.CREATENEW) {
      this.newOrderNumber = this.createOrderDto.orderNumber;
      this.newOrderVersionNumber = this.getCurrentDateAndTimeToBecomeOrderVersionNumber();
      this.newOrderTotalNumber = this.tableFormService.orderTotalNumber;
    }
  }

  private getCurrentDateAndTimeToBecomeOrderVersionNumber(): string {
    const now = new Date();
    const date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    const time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    const dateAndTimeNow = date + '.' + time;
    return dateAndTimeNow;

  }

  private setDateInOrderTable(): string{
    // tslint:disable-next-line:max-line-length
    if (this.orderOperationMode !== OrderOperationMode.SHOWDRAWING) {
      return  new Date().toLocaleDateString();
    }
  }

@HostListener('click', ['$event'])
listenToChangeProductEvent(event: any): void {
    const inputId = event.target.id;
    // tslint:disable-next-line:max-line-length
    const updateOrConfirmMode = this.orderOperationMode === OrderOperationMode.UPDATE || this.orderOperationMode === OrderOperationMode.CONFIRMNEW;
    if (event.target.id === 'confirmOrchangeProduct' && updateOrConfirmMode) {
      this.productHasBeenChanged = true;
      console.error(`this.productHasBeenChanged = ${this.productHasBeenChanged}`);
      this.submitButtonDescription = 'dalej';
      if (this.orderOperationMode === OrderOperationMode.CONFIRMNEW) {
        this.orderOperationMode = OrderOperationMode.CREATENEW;
      }
      if (this.orderOperationMode === OrderOperationMode.UPDATE) {
        this.orderOperationMode = OrderOperationMode.UPDATEWITHCHANGEDPRODUCT;
      }
    }
  }
}
