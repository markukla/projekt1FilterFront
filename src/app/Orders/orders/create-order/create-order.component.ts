import {AfterContentChecked, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
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
import Order from '../../OrdersTypesAndClasses/orderEntity';
import {CreateOrderDto} from '../../OrdersTypesAndClasses/orderDto';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit, AfterContentChecked {

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
  form: FormGroup;
  drawingPaths: DrawingPaths;
  isPartner: boolean;
  orderOperationMode: OrderOperationMode;
  orderToUpdate: Order;
  confirmOrCHangePartnerButtonInfo: string;
  changePartner: boolean;
  confirmOrCHangeProductParmatersButtonInfo: string;
  changeProduct: boolean;
  confirmOrCHangeMaterialButtonInfo: string;
  changeMaterial: boolean;
  onSubmitButtonInfo: string;

  constructor(
    private backendService: OrderBackendService,
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
    this.getDataToDropdownLists();
    this.getOrderTOupdateFromBackend();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      type: new FormControl(null, [Validators.required]),
      top: new FormControl(null, [Validators.required]),
      bottom: new FormControl(null, [Validators.required]),
      businessPartner: new FormControl(null, Validators.required),
      productMaterial: new FormControl(null, Validators.required)
    }, {updateOn: 'change'});

    this.orderOperationMode = this.orderTableService.orderOperationMode;
    this.setInitStateofConfirmOrCHangeButtonsAndSubmitButton();
    if (this.orderOperationMode === OrderOperationMode.UPDATE) {
      this.getOrderTOupdateFromBackend();
      this.setFormControlValuesForUpdateMode();
    }
    if (this.orderOperationMode === OrderOperationMode.CONFIRMNEW) {
      this.setFormControlValueForConfirmMode();
    }
    this.isPartner = this.authenticationService.userRole === RoleEnum.PARTNER;
  }

  setFormControlValuesForUpdateMode(): void {
    if (this.orderToUpdate) {
      this.type.setValue(this.orderToUpdate.product.productType);
      this.top.setValue(this.orderToUpdate.product.productTop);
      this.bottom.setValue(this.orderToUpdate.product.productBottom);
    }
  }

  setInitStateofConfirmOrCHangeButtonsAndSubmitButton(): void {
    if (this.orderTableService.orderOperationMode === OrderOperationMode.CREATENEW) {
      this.changeMaterial = false;
      this.changeProduct = false;
      this.changePartner = false;
      this.confirmOrCHangeProductParmatersButtonInfo = 'zatwierdź parametry produktu';
      this.confirmOrCHangeMaterialButtonInfo = 'zatwierdź materiał worka';
      this.confirmOrCHangePartnerButtonInfo = 'zatwierdż partnera handlowego';
      this.onSubmitButtonInfo = 'dalej';
    }
    // tslint:disable-next-line:max-line-length
    if (this.orderTableService.orderOperationMode === OrderOperationMode.UPDATE || this.orderTableService.orderOperationMode === OrderOperationMode.CONFIRMNEW) {
      this.changeMaterial = true;
      this.changeProduct = true;
      this.changePartner = true;
      this.onSubmitButtonInfo = 'złóż zapytanie';
      this.confirmOrCHangeProductParmatersButtonInfo = 'zmień parametry produktu';
      this.confirmOrCHangeMaterialButtonInfo = 'zmień materiał worka';
      this.confirmOrCHangePartnerButtonInfo = 'zmień partnera handlowego';
    }
  }

  getOrderTOupdateFromBackend(): void {
    if (this.orderTableService.selectedId) {
      this.backendService.findRecordById(String(this.orderTableService.selectedId)).subscribe((order) => {
        this.orderToUpdate = order.body;
        /* if enything is changed by the user this.backendService.createOrderDtoForConfirmUpdateShowDrawing has to be set to null */
        this.backendService.createOrderDtoForConfirmUpdateShowDrawing = this.backendService.getCreateOrderDtoFromOrder(this.orderToUpdate);
      }, error => {
        console.log('could not obtain orderToUpdate from backend');
      });
    }
  }

  setFormControlValueForConfirmMode(): void {
    if (this.backendService.createOrderDtoForConfirmUpdateShowDrawing) {
      const createOrderDto: CreateOrderDto = this.backendService.createOrderDtoForConfirmUpdateShowDrawing;
      this.type.setValue(createOrderDto.product.productType);
      this.top.setValue(createOrderDto.product.productTop);
      this.bottom.setValue(createOrderDto.product.productBottom);
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
    this.partnersBackendService.getAllRecords().subscribe((records) => {
      this.allParntersToSelect = records.body;
    }, error => {
      console.log('error during requesting partners from db');
    });
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
    if (this.orderTableService.orderOperationMode === OrderOperationMode.CREATENEW) {
      this.selectedtType = this.type.value;
      this.selectedBottom = this.bottom.value;
      this.selectedTop = this.top.value;
      if (!this.isPartner) {
        this.backendService.selectedParnter = this.businessPartner.value;
      } else if (this.isPartner) {
        this.backendService.selectedParnter = this.authenticationService.user;
      }
      this.backendService.selectedMaterial = this.productMaterial.value;
      const createProductDto: CreateProductDto = {
        productType: this.selectedtType,
        productBottom: this.selectedBottom,
        productTop: this.selectedTop
      };
      this.productBackendService.getProductByTypeTopBottom(createProductDto).subscribe((product) => {
        this.backendService.selectedProduct = product.body;
        this.router.navigateByUrl('/orders/drawing');
      }, error => {
        console.log('nie udało się znaleźć produktu na postawie wybranych parametrów');
        this.operationMessage = 'nie udało się znaleźć produktu na postawie wybranych parametrów. Spróbuj ponownie';
      });
      // tslint:disable-next-line:max-line-length
    } else if (this.orderTableService.orderOperationMode === OrderOperationMode.CONFIRMNEW || this.orderTableService.orderOperationMode === OrderOperationMode.UPDATE) {
      // tslint:disable-next-line:max-line-length
      let productMaterialOrPartnerHasNotBeenCHanged: boolean = this.changeMaterial === true && this.changeProduct === true && this.changePartner === true;
      if (productMaterialOrPartnerHasNotBeenCHanged) {
        this.backendService.addRecords(this.backendService.createOrderDtoForConfirmUpdateShowDrawing).subscribe((order) => {
            this.operationMessage = 'dodano nowe zamówienie';
          },
          error => {
            this.operationMessage = 'nie udało się dodać nowego zamówienia';

          });
      }
    }
  }

  closeAndGoBack(): void {
    this.router.navigateByUrl('/orders');
  }

  cleanOperationMessage(): void {
    setTimeout(() => {
      this.showoperationStatusMessage = null;
    }, 2000);
  }

  changeModeTOCreateNewIfPartnerProductOrMaterialChangedInUpdateOrCOnfirmMode(): void {
    // tslint:disable-next-line:max-line-length
    if (this.orderTableService.orderOperationMode === OrderOperationMode.UPDATE || this.orderTableService.orderOperationMode === OrderOperationMode.CONFIRMNEW) {
      // tslint:disable-next-line:max-line-length
      let productMaterialOrPartnerHastBeenCHanged: boolean = this.changeMaterial === false || this.changeProduct === false || this.changePartner === false;
      if (productMaterialOrPartnerHastBeenCHanged) {
        this.orderTableService.orderOperationMode = OrderOperationMode.CREATENEW;
      }
    }
  }

  ngAfterContentChecked(): void {
    this.onTypeSelectedSetTopsAndBottoms();
    this.changeModeTOCreateNewIfPartnerProductOrMaterialChangedInUpdateOrCOnfirmMode();
  }

  onTypeSelectedSetTopsAndBottoms(): void {
    const type = this.type.value;
    console.log(`selected type= ${type}`);
    if (type) {
      this.selectedtType = type;
      this.setTopsAndBottomsToSelectAfterTypeSelected(this.selectedtType);
    }
  }

  changeOrConfirmPartnerButtonAction(): void {
    if (this.changePartner === false && this.businessPartner.value) {
      this.businessPartner.disable({onlySelf: true});
      this.confirmOrCHangePartnerButtonInfo = 'Zmień Partnera Handlowego';
      this.changePartner = true;
    } else if (this.changePartner === true && this.businessPartner) {
      this.businessPartner.enable({onlySelf: true});
      const selectPartnerElement: HTMLElement = this.host.nativeElement.querySelector('businessPartner');
      this.confirmOrCHangePartnerButtonInfo = 'Zatwierdż Partnera Handlowego';
      this.changePartner = false;
    }


  }

  confirmOrchangeProductButtonAction(): void {
    if (this.changeProduct === false && this.businessPartner.value && this.type.value && this.top.value && this.bottom.value) {
      console.log('in confirmOrCHangeProductButtonMethod');
      this.type.disable({onlySelf: true});
      this.top.disable({onlySelf: true});
      this.bottom.disable({onlySelf: true});
      this.confirmOrCHangeProductParmatersButtonInfo = 'Zmień parametry produktu';
      this.changeProduct = true;
    } else if (this.changeProduct === true) {
      this.type.enable({onlySelf: true});
      this.top.enable({onlySelf: true});
      this.bottom.enable({onlySelf: true});
      this.confirmOrCHangeProductParmatersButtonInfo = 'Zatwierdź parametry produktu';
      this.businessPartner.enable({onlySelf: true});
      this.changeProduct = false;
    }

  }

  confirmOrChangeMaterialButtonAction(): void {
    if (this.changeMaterial === false) {
      this.productMaterial.disable({onlySelf: true});
      this.confirmOrCHangeMaterialButtonInfo = 'Zmień materiał';
      this.changeMaterial = true;
    } else if (this.changePartner === true) {
      this.productMaterial.enable({onlySelf: true});
      this.confirmOrCHangeMaterialButtonInfo = 'Zatwierdż materiał';
      this.changeMaterial = false;
    }

  }
}
