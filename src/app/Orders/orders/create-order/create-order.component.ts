import {AfterContentChecked, Component, OnInit} from '@angular/core';
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
  uploadSuccessStatus: boolean;
  drawingPaths: DrawingPaths;
  isPartner: boolean;

  constructor(
    private backendService: OrderBackendService,
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
  }

  ngOnInit(): void {
    this.isPartner = this.authenticationService.userRole === RoleEnum.PARTNER;
    this.form = new FormGroup({
      type: new FormControl(null, [Validators.required] ),
      top: new FormControl(null, [Validators.required] ),
      bottom: new FormControl(null, [Validators.required]),
      businessPartner: new FormControl(null, Validators.required),
      productMaterial: new FormControl(null, Validators.required)
    }, {updateOn: 'change'});

  }
  // tslint:disable-next-line:typedef
  get  type() {
    return this.form.get('type');
  }
// tslint:disable-next-line:typedef
  get  top() {
    return this.form.get('top');
  }
  // tslint:disable-next-line:typedef
  get  bottom() {
    return this.form.get('bottom');
  }
  // tslint:disable-next-line:typedef
  get  businessPartner() {
    return this.form.get('businessPartner');
  }
  // tslint:disable-next-line:typedef
  get  productMaterial() {
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
    this.selectedtType = this.type.value;
    this.selectedBottom = this.bottom.value;
    this.selectedTop = this.top.value;
    if (!this.isPartner) {
      this.backendService.selectedParnter = this.businessPartner.value;
    }
    else if (this.isPartner) {
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
  }
  closeAndGoBack(): void {
    this.router.navigateByUrl('/orders');
  }

  cleanOperationMessage(): void {
    setTimeout(() => {
      this.showoperationStatusMessage = null;
    }, 2000);
  }

  ngAfterContentChecked(): void {
    this.onTypeSelectedSetTopsAndBottoms();
  }
  onTypeSelectedSetTopsAndBottoms(): void {
    const type = this.type.value;
    console.log(`selected type= ${type}`);
    if (type) {
      this.selectedtType = type;
      this.setTopsAndBottomsToSelectAfterTypeSelected(this.selectedtType);
    }
  }

}
