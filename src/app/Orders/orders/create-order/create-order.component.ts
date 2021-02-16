import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
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
import OrderDetails from '../../OrdersTypesAndClasses/orderDetail';
import LocalizedName from '../../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import {
  getSelectedLanguageFromNamesInAllLanguages,
  setTabelColumnAndOtherNamesForSelectedLanguage
} from '../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage';
import {ProductMiniatureService} from '../productMiniature/productMiniatureService/product-miniature.service';
import {navigateToUrlAfterTimout} from '../../../helpers/otherGeneralUseFunction/navigateToUrlAfterTimeOut';
import {
  generalNamesInSelectedLanguage,
  generalUserNames,
  orderNames
} from '../../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription';

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
  selctedOrderId: string;
  allTypesForExistingProducts: ProductType[];
  allusedForCreatingProductProductTops: ProductTop[];
  allusedForCreatinfProductProductBottoms: ProductBottom [];
  allProducts: Product[];
  operationSuccessStatusMessage: string;
  operationFailerStatusMessage: string;
  orderNames = orderNames;
  generalUserNames = generalUserNames;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  @ViewChild('commentToOrder', {read: ElementRef}) commentToOrder: ElementRef;
  constructor(
    private backendService: OrderBackendService,
    private productMiniatureService: ProductMiniatureService,
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
    this.form = new FormGroup({
      type: new FormControl(null),
      top: new FormControl(null),
      bottom: new FormControl(null),
      businessPartner: new FormControl(null, Validators.required),
      productMaterial: new FormControl(null, Validators.required)
    }, {updateOn: 'change'});
    this.initColumnNamesInSelectedLanguage();
    this.productHasBeenChanged = false;
    this.isPartner = this.authenticationService.userRole === RoleEnum.PARTNER;
    await this.getDataToDropdownLists();
    await this.setOrderOperatiomModeBasingOnQueryParamtersAndInitPropertyValues();
  }
  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.orderNames, this.authenticationService.vocabulariesInSelectedLanguage);
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalNamesInSelectedLanguage, this.authenticationService.vocabulariesInSelectedLanguage);
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalUserNames, this.authenticationService.vocabulariesInSelectedLanguage);

  }

   async setOrderOperatiomModeBasingOnQueryParamtersAndInitPropertyValues(): Promise<void> {
    this.route.queryParamMap.subscribe(async queryParams => {
      const mode = queryParams.get('mode');
      const orderId = queryParams.get('orderId');
      this.selctedOrderId = orderId;
      if (mode === OrderOperationMode.CREATENEW ) {
        this.orderOperationMode = OrderOperationMode.CREATENEW;
        if (this.backendService.createOrderDtoForConfirmUpdateShowDrawing) {
          this.productHasBeenChanged = true;
          this.createOrderDto = this.backendService.createOrderDtoForConfirmUpdateShowDrawing;
        }
        else {
          this.createOrderDto = {
            product: null,
            businessPartner: null,
            productMaterial: null,
            date: null,
            creator: null,
            commentToOrder: null,
            orderVersionNumber: null,
            orderTotalNumber: null,
            index: null,
            orderName: null,
            orderDetails: null,
            orderNumber: null,
          };
        }
        this.setInitStateofConfirmOrCHangeButtonsAndSubmitButton();
        this.setOrderNumbersinOrderTableForNewOrder();
        this.setFormControlValuesForUpdateOrShowDrawingMode(this.createOrderDto);
      } else if (mode === OrderOperationMode.UPDATE || mode === OrderOperationMode.SHOWDRAWING) {
        if (mode === OrderOperationMode.UPDATE) {
          this.orderOperationMode = OrderOperationMode.UPDATE;
        }
        else if (mode === OrderOperationMode.SHOWDRAWING) {
          this.orderOperationMode = OrderOperationMode.SHOWDRAWING;
        }
        const selectedOrder = await this.backendService.findRecordById(orderId).toPromise();
        if (this.productMiniatureService.productChangedByDrawingCliclingInUpdateOrConfirmModes === true) {
          this.productHasBeenChanged = true;
          this.createOrderDto = this.backendService.createOrderDtoForConfirmUpdateShowDrawing;
        }
        else {
          this.createOrderDto = this.backendService.getCreateOrderDtoFromOrder(selectedOrder.body);
        }
        this.setFormControlValuesForUpdateOrShowDrawingMode(this.createOrderDto);
        this.setInitStateofConfirmOrCHangeButtonsAndSubmitButton();
        // tslint:disable-next-line:max-line-length
      } else if (mode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT || mode === OrderOperationMode.CONFIRMUPDATE || mode === OrderOperationMode.UPDATEDRAWING || mode === OrderOperationMode.CONFIRMNEW || mode === OrderOperationMode.SHOWDRAWINGCONFIRM) {
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
        if (this.productMiniatureService.productChangedByDrawingCliclingInUpdateOrConfirmModes === true) {
          this.productHasBeenChanged = true;
        }
        this.setFormControlValuesForUpdateOrShowDrawingMode(this.createOrderDto);
        this.setInitStateofConfirmOrCHangeButtonsAndSubmitButton();
      }
    });
  }

setFormControlValuesForUpdateOrShowDrawingMode(createOrderDto: CreateOrderDto): void {
    if (createOrderDto) {
      console.error('in setFormControlValuesForUpdateOrShowDrawingMode');
      if (createOrderDto.businessPartner) {
        this.businessPartner.setValue(createOrderDto.businessPartner);
        this.selectedPartner = createOrderDto.businessPartner;
      }
      if (createOrderDto.productMaterial) {
        this.productMaterial.setValue(createOrderDto.productMaterial);
        this.selectedMaterial = createOrderDto.productMaterial;
      }
      if (createOrderDto.product) {
        this.type.setValue(createOrderDto.product.productType);
        this.top.setValue(createOrderDto.product.productTop);
        this.bottom.setValue(createOrderDto.product.productBottom);
        this.selectedtType = createOrderDto.product.productType;
        this.selectedTop = createOrderDto.product.productTop;
        this.selectedBottom = createOrderDto.product.productBottom;
        this.selectedProduct = createOrderDto.product;
      }
    }
  }

setInitStateofConfirmOrCHangeButtonsAndSubmitButton(): void {
    if (this.orderOperationMode === OrderOperationMode.CREATENEW) {
      this.submitButtonDescription = orderNames.submitButtonNext;
      if (this.createOrderDto.productMaterial) {
        this.materialConfirmed = true;
        this.confirmOrCHangeMaterialButtonInfo = orderNames.ChangeMaterialButtonInfo;
      }
      else {
        this.materialConfirmed = false;
        this.confirmOrCHangeMaterialButtonInfo = orderNames.ConfirmMaterial;
      }
      if (!this.productMiniatureService.selectedProduct) {
        this.productConfirmed = false;
        this.confirmOrCHangeProductParmatersButtonInfo = orderNames.ConfirmProduct;
      }
      else {
        this.productConfirmed = true;
        this.confirmOrCHangeProductParmatersButtonInfo = orderNames.ChangeProduct;
      }
      if (this.createOrderDto.businessPartner) {
        this.partnerConfirmed = true;
        this.confirmOrCHangePartnerButtonInfo = orderNames.ChangePartner;
      }
      else {
        this.partnerConfirmed = false;
        this.confirmOrCHangePartnerButtonInfo = orderNames.ConfirmPartner;
      }
      this.onSubmitButtonInfo = orderNames.submitButtonNext;
      this.operationModeEqualConfirmNewOrUpdate = false;
    }
    // tslint:disable-next-line:max-line-length
    else if (this.orderOperationMode === OrderOperationMode.CONFIRMNEW || OrderOperationMode.CONFIRMUPDATE) {
      this.operationModeEqualConfirmNewOrUpdate = true;
      this.submitButtonDescription = orderNames.submitOrder;
      this.materialConfirmed = true;
      this.productConfirmed = true;
      this.partnerConfirmed = true;
      this.onSubmitButtonInfo = orderNames.submitOrder;
      this.confirmOrCHangeProductParmatersButtonInfo = orderNames.ChangeProduct;
      this.confirmOrCHangeMaterialButtonInfo = orderNames.ChangeMaterialButtonInfo;
      this.confirmOrCHangePartnerButtonInfo = orderNames.ChangeMaterialButtonInfo;
    } else if (this.orderOperationMode === OrderOperationMode.UPDATE) {
      this.operationModeEqualConfirmNewOrUpdate = true;
      this.submitButtonDescription = orderNames.updateOrder;
      this.materialConfirmed = true;
      this.productConfirmed = true;
      this.partnerConfirmed = true;
      this.onSubmitButtonInfo = orderNames.updateOrder;
      this.confirmOrCHangeProductParmatersButtonInfo = orderNames.ChangeProduct;
      this.confirmOrCHangeMaterialButtonInfo =  orderNames.ChangeMaterialButtonInfo;
      this.confirmOrCHangePartnerButtonInfo = orderNames.ChangePartner;
    }
  }

setFormControlValueForConfirmMode(createOrderDto: CreateOrderDto): void {
    if (createOrderDto) {
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

async getDataToDropdownLists(): Promise<void> {
  if (this.isPartner === false) {
    this.partnersBackendService.getAllRecords().subscribe((records) => {
      this.allParntersToSelect = records.body;
    }, error => {
      console.log('error during requesting partners from db');
    });
  }
  else if(this.isPartner === true) {
    this.selectedPartner = this.authenticationService.user;
  }
  this.materialBackendService.getRecords().subscribe((records) => {
    this.allMaterialsToSelect = records.body;
  }, error => {
    console.log('error during requesting materials from db');
  });

  this.allTypesForExistingProducts = [];
  this.allusedForCreatingProductProductTops = [];
  this.allusedForCreatinfProductProductBottoms = [];
  const allProducts = await this.productBackendService.getRecords().toPromise();
  this.allProducts = allProducts.body;
  const allTypes = await this.typesBackendService.getRecords().toPromise();
  allProducts.body.forEach((product) => {
    this.allTypesForExistingProducts.push(product.productType);
    this.allusedForCreatinfProductProductBottoms.push(product.productBottom);
    this.allusedForCreatingProductProductTops.push(product.productTop);
  });
  /* filter does not accept complex expression with {} */
  this.allTypesToSelect = allTypes.body.filter(type =>
    this.allTypesForExistingProducts.map(productType =>
      productType.id).includes(type.id)
  );
}

setTopsAndBottomsToSelectAfterTypeSelected(productType: ProductType): void {
    this.allTopsToSelect = productType.topsForThisProductType.filter(topsInProductType =>
      this.allusedForCreatingProductProductTops.map(productTop =>
        productTop.id).includes(topsInProductType.id)
    );
    this.allBotomsToselect = productType.bottomsForThisProductType.filter(bottomsInProductType =>
    this.allusedForCreatinfProductProductBottoms.map(productTop =>
      productTop.id).includes(bottomsInProductType.id));
  }

onSubmit(): void {
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
        this.createOrderDto = {
          ...this.backendService.createOrderDtoForConfirmUpdateShowDrawing,
          businessPartner: this.selectedPartner,
          index: null,
          orderName: null,
          commentToOrder: null,
          product: this.selectedProduct,
          productMaterial: this.selectedMaterial,
          date: this.setDateInOrderTable(),
          orderNumber: this.newOrderNumber,
          orderVersionNumber: this.newOrderVersionNumber,
          orderTotalNumber: this.newOrderTotalNumber,
          creator: this.authenticationService.user,
          orderDetails: null,
        };
        this.tableFormService.setInitDataFromDrawingTableFromCreateOrderDto(this.createOrderDto);
        this.createOrderDto.index = this.tableFormService.index;
        this.createOrderDto.orderName = this.tableFormService.orderName;
        this.backendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDto;
        this.router.navigateByUrl(`/orders/drawing?mode=${OrderOperationMode.CREATENEW}`);
      }, error => {
        console.log('nie udało się znaleźć produktu na postawie wybranych parametrów');
        this.operationMessage = orderNames.canNotFindProductForGivenParameters;
      });
      // tslint:disable-next-line:max-line-length
    } else if (this.orderOperationMode === OrderOperationMode.CONFIRMNEW) {
      if (this.productHasBeenChanged === false) {

        this.createOrderDto = this.updateCreateOrderDto(this.createOrderDto);
        this.backendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDto;
        this.backendService.addRecords(this.createOrderDto).subscribe((order) => {
            this.operationSuccessStatusMessage = orderNames.orderAddSuccess;
            navigateToUrlAfterTimout('/orders', this.router, 2000);
          },
          error => {
            this.operationFailerStatusMessage = orderNames.orderAddFailer;

          });
      }
    } else if (this.orderOperationMode === OrderOperationMode.UPDATE || this.orderOperationMode === OrderOperationMode.CONFIRMUPDATE) {

      if (this.productHasBeenChanged === false) {
        const updatedCreateOrderDto = this.updateCreateOrderDto(this.createOrderDto);
        this.createOrderDto = updatedCreateOrderDto;
        this.backendService.updateRecordById(String(this.selctedOrderId), this.createOrderDto).subscribe((order) => {
            this.operationSuccessStatusMessage = orderNames.orderUpdateSuccess;
            navigateToUrlAfterTimout('/orders', this.router, 2000);
          },
          error => {
          console.log(error);
          this.operationFailerStatusMessage = orderNames.orderUpdateFailer;
          });
      }
      // tslint:disable-next-line:max-line-length
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
        this.createOrderDto.orderDetails = null;  // to reset dimensions and tableForm values
        this.createOrderDto = this.updateCreateOrderDto(this.createOrderDto);
        this.backendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDto;
        this.router.navigateByUrl(`/orders/drawing?orderId=${this.selctedOrderId}&mode=${OrderOperationMode.UPDATEWITHCHANGEDPRODUCT}`);
      }, error => {
        console.log('nie udało się znaleźć produktu na postawie wybranych parametrów');
        this.operationMessage = orderNames.canNotFindProductForGivenParameters;
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

changeModeTOUpdatedWithChangedProductOrCreateNew(): void {
    if (this.productHasBeenChanged === true) {
      if (this.orderOperationMode === OrderOperationMode.UPDATE || this.orderOperationMode === OrderOperationMode.CONFIRMUPDATE) {
        this.orderOperationMode = OrderOperationMode.UPDATEWITHCHANGEDPRODUCT;
        this.submitButtonDescription = orderNames.submitButtonNext;
      }
      else if (this.orderOperationMode === OrderOperationMode.CONFIRMNEW) {
        this.orderOperationMode = OrderOperationMode.CREATENEW;
        this.newOrderNumber = this.backendService.createOrderDtoForConfirmUpdateShowDrawing.orderNumber;
        this.newOrderVersionNumber = this.backendService.createOrderDtoForConfirmUpdateShowDrawing.orderVersionNumber;
        this.newOrderTotalNumber = this.backendService.createOrderDtoForConfirmUpdateShowDrawing.orderTotalNumber;
        this.orderOperationMode = OrderOperationMode.CREATENEW;
        this.submitButtonDescription = orderNames.submitButtonNext;
      }
    }
  }

ngAfterContentChecked(): void {
    this.checkOperationMode();
    this.setUpdateModeOrPartnerLoggedValue();
    this.setAllowSubmit();
    this.changeModeTOUpdatedWithChangedProductOrCreateNew();
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
      this.confirmOrCHangePartnerButtonInfo = orderNames.ChangePartner;
      if (this.backendService.createOrderDtoForConfirmUpdateShowDrawing) {
        this.backendService.createOrderDtoForConfirmUpdateShowDrawing.businessPartner = this.selectedPartner;
      }
      this.partnerConfirmed = true;
    } else if (this.partnerConfirmed === true && this.businessPartner) {
      this.businessPartner.enable({onlySelf: true});
      this.confirmOrCHangePartnerButtonInfo = orderNames.ConfirmPartner;
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
      this.confirmOrCHangeProductParmatersButtonInfo = orderNames.ChangeProduct;
      this.productConfirmed = true;
    } else if (this.productConfirmed === true) {
      this.type.enable({onlySelf: true});
      this.top.enable({onlySelf: true});
      this.bottom.enable({onlySelf: true});
      this.confirmOrCHangeProductParmatersButtonInfo = orderNames.ConfirmProduct;
      this.businessPartner.enable({onlySelf: true});
      this.productConfirmed = false;
    }

  }
   chooseProductByMiniatureButtonAction(): void{
     // tslint:disable-next-line:max-line-length
     if (this.orderOperationMode === OrderOperationMode.CREATENEW || this.orderOperationMode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT ) {
      this.productMiniatureService.productChangedByDrawingCliclingInUpdateOrConfirmModes = true;
     }
     this.productMiniatureService.allProducts = this.allProducts;
    // tslint:disable-next-line:max-line-length
     const createProductDto: CreateProductDto = {
      productType: this.selectedtType,
      productTop: this.selectedTop,
      productBottom: this.selectedBottom,
    };
     this.productBackendService.getProductByTypeTopBottom(createProductDto).subscribe((product) => {
      // tslint:disable-next-line:max-line-length
      this.productMiniatureService.selectedProduct = product.body;
      // tslint:disable-next-line:max-line-length
      this.backendService.createOrderDtoForConfirmUpdateShowDrawing =  this.updateCreateOrderDtoForChooseDrawingByMiniature(this.createOrderDto, product.body);
      this.router.navigateByUrl('/products/chooseByMiniature');
      console.log('navigated to on sucess');
    }, error => {
      // tslint:disable-next-line:max-line-length
      this.backendService.createOrderDtoForConfirmUpdateShowDrawing =  this.updateCreateOrderDtoForChooseDrawingByMiniature(this.createOrderDto, null);
      this.router.navigateByUrl('/products/chooseByMiniature');
      console.log('navigated to on error');
    });
  }

confirmOrChangeMaterialButtonAction(): void {
    if (this.materialConfirmed === false) {
      this.productMaterial.disable({onlySelf: true});
      this.confirmOrCHangeMaterialButtonInfo = orderNames.ChangeMaterialButtonInfo
      this.selectedMaterial = this.productMaterial.value;
      if (this.backendService.createOrderDtoForConfirmUpdateShowDrawing) {
        this.backendService.createOrderDtoForConfirmUpdateShowDrawing.productMaterial = this.selectedMaterial;
      }
      this.materialConfirmed = true;
    } else if (this.materialConfirmed === true) {
      this.productMaterial.enable({onlySelf: true});
      this.confirmOrCHangeMaterialButtonInfo = orderNames.ConfirmMaterial;
      this.materialConfirmed = false;
    }

  }

ngAfterViewInit(): void {
  }

ngAfterViewChecked(): void {
  }

checkOperationMode(): void {
    // tslint:disable-next-line:max-line-length
    if (this.orderOperationMode !== OrderOperationMode.CREATENEW && this.orderOperationMode !== OrderOperationMode.UPDATEWITHCHANGEDPRODUCT) {
      this.operationModeEqualConfirmNewOrUpdate = true;
    } else {
      this.operationModeEqualConfirmNewOrUpdate = false;
    }
  }

seeDrawing(): void {
     this.createOrderDto = this.updateCreateOrderDto(this.createOrderDto);
     this.backendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDto;
     if (this.orderOperationMode === OrderOperationMode.CONFIRMNEW) {
    this.router.navigateByUrl(`orders/drawing?mode=${OrderOperationMode.SHOWDRAWINGCONFIRM}`);
  }
  else if (this.orderOperationMode === OrderOperationMode.CONFIRMUPDATE || this.orderOperationMode === OrderOperationMode.UPDATE) {
    this.router.navigateByUrl(`orders/drawing?orderId=${this.selctedOrderId}&mode=${OrderOperationMode.SHOWDRAWINGCONFIRM}`);
  }
  }

updateDrawing(): void {
    this.createOrderDto = this.updateCreateOrderDto(this.createOrderDto);
    this.backendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDto;
    if (this.orderOperationMode === OrderOperationMode.CONFIRMNEW) {
    this.router.navigateByUrl(`orders/drawing?mode=${OrderOperationMode.UPDATEDRAWING}`);
  }
  else if (this.orderOperationMode === OrderOperationMode.CONFIRMUPDATE || this.orderOperationMode === OrderOperationMode.UPDATE) {
    this.router.navigateByUrl(`orders/drawing?orderId=${this.selctedOrderId}&mode=${OrderOperationMode.UPDATEDRAWING}`);
  }
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
      }, error => {
        console.log('could not obtain newOrderNumber For new Order from backend');
      });
      // tslint:disable-next-line:max-line-length
  }
  }
setOrderNumbersinOrderTableForUpdateOrConfirmModes(): void {
    if (this.orderOperationMode !== OrderOperationMode.SHOWDRAWING && this.orderOperationMode !== OrderOperationMode.CREATENEW) {
      this.newOrderNumber = this.createOrderDto.orderNumber;
      this.newOrderVersionNumber = this.getCurrentDateAndTimeToBecomeOrderVersionNumber();
      this.newOrderTotalNumber = this.newOrderNumber + '.' + this.newOrderVersionNumber;
    }
  }

  private getCurrentDateAndTimeToBecomeOrderVersionNumber(): string {
    const now = new Date();
    const date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    const time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    const dateAndTimeNow = date + '.' + time;
    return dateAndTimeNow;

  }

  private setDateInOrderTable(): Date{
    // tslint:disable-next-line:max-line-length
    if (this.orderOperationMode !== OrderOperationMode.SHOWDRAWING) {
      return  new Date();
    }
  }
  updateCreateOrderDto(createOrderDto: CreateOrderDto): CreateOrderDto {
    this.setOrderNumbersinOrderTableForUpdateOrConfirmModes();
    let commmentToOrder: string;
    if (this.commentToOrder && this.commentToOrder.nativeElement.value) {
      commmentToOrder = this.commentToOrder.nativeElement.value;
    }
    else {
      commmentToOrder = '';
    }
    const orderDetails: OrderDetails = {...this.createOrderDto.orderDetails,
    id: null};
    const updatedCreateOrderDtoWithoutIndexAndOrderNameRebuild: CreateOrderDto = {
        ...createOrderDto,
        businessPartner: this.selectedPartner,
        productMaterial: this.selectedMaterial,
        product: this.selectedProduct,
        orderDetails,
        commentToOrder: commmentToOrder,
        // tslint:disable-next-line:max-line-length
        index: null,  // if index and order name set to null they will be automaticaly updated by next method: this.tableFormService.setInitDataFromDrawingTableFromCreateOrderDto(updatedCreateOrderDtoWithoutIndexAndOrderNameRebuild);
        orderName: null,  // cause it call buildIndex() and setOrderNameMethods(); where these values are null
        orderNumber: this.newOrderNumber,
        date: this.setDateInOrderTable(),
        orderVersionNumber: this.newOrderVersionNumber,
        orderTotalNumber: this.newOrderTotalNumber,
      };
    this.tableFormService.setInitDataFromDrawingTableFromCreateOrderDto(updatedCreateOrderDtoWithoutIndexAndOrderNameRebuild);
    const updatedCreateOrderDto: CreateOrderDto = {
      ... updatedCreateOrderDtoWithoutIndexAndOrderNameRebuild,
      index: this.tableFormService.index,
      orderName: this.tableFormService.orderName
    };
    return updatedCreateOrderDto;
  }

@HostListener('click', ['$event'])
listenToChangeProductEvent(event: any): void {
    const inputId = event.target.id;
    // tslint:disable-next-line:max-line-length
    const updateOrConfirmMode = this.orderOperationMode === OrderOperationMode.UPDATE || this.orderOperationMode === OrderOperationMode.CONFIRMNEW || this.orderOperationMode === OrderOperationMode.CONFIRMUPDATE;
    if (event.target.id === 'confirmOrchangeProduct' && updateOrConfirmMode) {
      this.productHasBeenChanged = true;
      console.error(`this.productHasBeenChanged = ${this.productHasBeenChanged}`);
    }
  }
  setProductHasBennChangedToTrue(): void {
    this.productHasBeenChanged = true;
  }
  getNameInSelectedLanguage(localizedNames: LocalizedName[]): string {
    return getSelectedLanguageFromNamesInAllLanguages(localizedNames, this.authenticationService.selectedLanguageCode);
  }
  updateCreateOrderDtoForChooseDrawingByMiniature(createOrderDto: CreateOrderDto, product: Product): CreateOrderDto {
    const updatedCreateOrderDto = {
      ... createOrderDto,
      productMaterial: this.selectedMaterial,
      businessPartner: this.selectedPartner,
      product
    };
    return updatedCreateOrderDto;
  }
}
