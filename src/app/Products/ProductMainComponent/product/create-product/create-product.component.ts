import {AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import ProductBottom from '../../../ProductTypesAndClasses/productBottom.entity';
import ProductTop from '../../../ProductTypesAndClasses/productTop.entity';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductTypeBackendService} from '../../../ProductType/ProductTypeServices/product-type-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import ProductType from '../../../ProductTypesAndClasses/productType.entity';
import {ProductBackendService} from '../ProductServices/product-backend.service';
import {ProductValidatorService} from '../ProductServices/product-validator.service';
import {DrawingPaths} from '../../../ProductTypesAndClasses/drawingPaths';
import {getBackendErrrorMesage} from '../../../../helpers/errorHandlingFucntion/handleBackendError';
import OrderOperationMode from '../../../../Orders/OrdersTypesAndClasses/orderOperationMode';
import ProductModeEnum from '../../../ProductTypesAndClasses/productMode';
import Product from '../../../ProductTypesAndClasses/product.entity';
import LocalizedName from '../../../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import {getSelectedLanguageFromNamesInAllLanguages} from '../../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage';
import {AuthenticationService} from '../../../../LoginandLogOut/AuthenticationServices/authentication.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit, AfterContentChecked, AfterViewChecked, AfterViewInit {
  operationMessage: string;
  uploadOperationMessage: string;
  showoperationStatusMessage: string;
  allBotomsToselect: ProductBottom[];
  allTopsToSelect: ProductTop[];
  allTypesToSelect: ProductType[];
  form: FormGroup;
  orginalDrawingPath: string;
  minimalizedDrawingPath: string;
  upladDrawingForm: FormGroup;
  uploadSuccessStatus = false;
  drawingPaths: DrawingPaths;
  operationMode: ProductModeEnum;
  selectedProductToUpdateId: string;
  productToUpdate: Product;
  changeDrawingClicked = false;
  selectTopClicked = false;
  selectBottomClicked = false;
  changeDrawingButtonDescription: string;
  productTypeOfProductToUpdate: ProductType;
  @ViewChild('selectType', {read: ElementRef}) selectTypeElement: ElementRef;
  @ViewChild('selectTop', {read: ElementRef}) selectTopElement: ElementRef;
  @ViewChild('selectBottom', {read: ElementRef}) selectBottomElement: ElementRef;


  constructor(
    private backendService: ProductBackendService,
    public validationService: ProductValidatorService,
    private typesBackendService: ProductTypeBackendService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private element: ElementRef,
    private router: Router,
    private authenticationService: AuthenticationService) {
  }

  async ngOnInit(): Promise<void> {
    this.form = new FormGroup({
      type: new FormControl(null, [Validators.required]),
      top: new FormControl(null, [Validators.required]),
      bottom: new FormControl(null, [Validators.required])
    }, {updateOn: 'change'});
    this.upladDrawingForm = new FormGroup({
      file: new FormControl('', Validators.required),
      fileSource: new FormControl('', [Validators.required])
    });
    this.initUserInterfaceVariablesForGivenLanguage();
    this.route.queryParamMap.subscribe(queryParams => {
      const mode = queryParams.get('mode');
      this.selectedProductToUpdateId = queryParams.get('productId');
      if (mode === ProductModeEnum.CREATENEW) {
        this.operationMode = ProductModeEnum.CREATENEW;
      } else if (mode === ProductModeEnum.UPDATE) {
        this.operationMode = ProductModeEnum.UPDATE;

      }
    });
    await this.getDataToDropdownLists();
    if (this.operationMode === ProductModeEnum.UPDATE) {
      const foundProduct = await this.backendService.findRecordById(this.selectedProductToUpdateId).toPromise();
      this.productToUpdate = foundProduct.body;
      // tslint:disable-next-line:max-line-length
      await this.initFormValuesForUpdateMode(this.productToUpdate); // it does not set select element it is done in ngAfterContent checked due to ngFor synchronization problem
    }
    this.uploadSuccessStatus = false;
  }
  initUserInterfaceVariablesForGivenLanguage(): void {
    this.changeDrawingButtonDescription = 'zmień rysunek';
  }

  setSelectedValueForSelectElement(selectId: string, selectedValueId: string): void {
    const selectElement: HTMLSelectElement = this.element.nativeElement.querySelector('[id=' + selectId + ']');
    const selectValueElement: HTMLOptionElement = this.element.nativeElement.querySelector('[id=' + selectedValueId + ']');
    selectElement.value = selectValueElement.value;
  }

// tslint:disable-next-line:typedef
  get top() {
    return this.form.get('top');
  }

  // tslint:disable-next-line:typedef
  get type() {
    return this.form.get('type');
  }

  // tslint:disable-next-line:typedef
  get fileSource() {
    return this.form.get('fileSource');
  }

  // tslint:disable-next-line:typedef
  get bottom() {
    return this.form.get('bottom');
  }

  // tslint:disable-next-line:typedef
  get file() {
    return this.upladDrawingForm.get('file');
  }

  async getDataToDropdownLists(): Promise<void> {
    const allTypes = await this.typesBackendService.getRecords().toPromise();
    this.allTypesToSelect = allTypes.body;
  }

  setTopsAndBottomsToSelectAfterTypeSelected(productType: ProductType): void {
    if (productType) {
      this.allTopsToSelect = productType.topsForThisProductType;
      this.allBotomsToselect = productType.bottomsForThisProductType;
    }
  }

  async initFormValuesForUpdateMode(productToUpdate: Product): Promise<void> {
    const productTypeOfPtoductToUpdate = await this.typesBackendService.findRecordById(String(productToUpdate.productType.id)).toPromise();
    this.productTypeOfProductToUpdate = productTypeOfPtoductToUpdate.body;
    this.form.controls.type.setValue(this.productTypeOfProductToUpdate);
    this.bottom.setValue(this.productToUpdate.productBottom);
    this.top.setValue(this.productToUpdate.productTop);
    this.minimalizedDrawingPath = productToUpdate.urlOfThumbnailDrawing;
    this.orginalDrawingPath = productToUpdate.urlOfOrginalDrawing;
  }

  onSubmit(): void {
    if (this.operationMode === ProductModeEnum.CREATENEW) {
      this.backendService.createProductDto = {
        dimensionsTextFieldInfo: null,
        productBottom: this.bottom.value,
        productTop: this.top.value,
        productType: this.type.value,
        urlOfOrginalDrawing: this.orginalDrawingPath,
        urlOfThumbnailDrawing: this.minimalizedDrawingPath,
      };
      this.router.navigateByUrl(`orders/drawing?mode=${OrderOperationMode.CREATENEWPRODUCT}`);
    }  else if (this.operationMode === ProductModeEnum.UPDATE && this.changeDrawingClicked === true) {
      this.backendService.createProductDto = {
        dimensionsTextFieldInfo: null,
        productBottom: this.bottom.value,
        productTop: this.top.value,
        productType: this.type.value,
        urlOfOrginalDrawing: this.orginalDrawingPath,
        urlOfThumbnailDrawing: this.minimalizedDrawingPath,
      };
      this.router.navigateByUrl(`orders/drawing?productId=${this.selectedProductToUpdateId}&mode=${OrderOperationMode.UPDATEPRODUCT}`);
    }
    else if (this.operationMode === ProductModeEnum.UPDATE) {
      this.backendService.createProductDto = {
        dimensionsTextFieldInfo: this.productToUpdate.dimensionsTextFieldInfo,
        productBottom: this.bottom.value,
        productTop: this.top.value,
        productType: this.type.value,
        urlOfOrginalDrawing: this.orginalDrawingPath,
        urlOfThumbnailDrawing: this.minimalizedDrawingPath,
      };
      this.router.navigateByUrl(`orders/drawing?productId=${this.selectedProductToUpdateId}&mode=${OrderOperationMode.UPDATEPRODUCT}`);
    }
  }
  onUpload(): void {
    this.uploadSuccessStatus = false;
    const formData = new FormData();
    formData.append('file', this.upladDrawingForm.get('fileSource').value);
    this.backendService.uploadDrawing(formData).subscribe((urls) => {
      this.orginalDrawingPath = urls.urlOfOrginalDrawing;
      this.minimalizedDrawingPath = urls.urlOfThumbnailDrawing;
      this.uploadOperationMessage = 'dodano rysunek';
      this.uploadSuccessStatus = true;
    }, error => {
      this.uploadSuccessStatus = false;
      const errorMessage = getBackendErrrorMesage(error);
      if (errorMessage.includes('.png files are allowed')) {
        this.uploadOperationMessage = 'nie udało sie dodać rysunku, tylko format .png jest dozwolony';
      } else {
        this.uploadOperationMessage = 'wystąpił błąd nie udało się dodać rysunku, spróbuj pownownie';
      }
    });

  }

  onFileChange(event): void {
    if (event.target.files.length > 0) {
      this.uploadOperationMessage = null;
      const file = event.target.files[0];
      this.upladDrawingForm.patchValue({
        fileSource: file
      });
    }
  }

  closeAndGoBack(): void {
    this.router.navigateByUrl('/products');
  }

  cleanOperationMessage(): void {
    setTimeout(() => {
      this.showoperationStatusMessage = null;
    }, 2000);
  }

  ngAfterContentChecked(): void {
    // tslint:disable-next-line:max-line-length
    if (this.productTypeOfProductToUpdate && this.type.value.code === this.productTypeOfProductToUpdate.code && this.selectTopClicked === false && this.selectBottomClicked === false) {
      this.initSelectElementsFromProductToupdate();
    }
    if (this.type.value) {

      this.setTopsAndBottomsToSelectAfterTypeSelected(this.type.value);
    }
  }

  initSelectElementsFromProductToupdate(): void {
    console.error(` this.productTypeOfProductToUpdate.code =${this.productTypeOfProductToUpdate.code}`);
    const HtmlTypeOptionElement: HTMLOptionElement[] = this.element.nativeElement.querySelectorAll('.selectTypeValues');
    const productTypeId = `type${this.productToUpdate.productType.id}`;
    HtmlTypeOptionElement.forEach((option) => {
      if (option.id === productTypeId) {
        this.selectTypeElement.nativeElement.value = option.value;
      }
    });
    const HtmlTopOptionElement: HTMLOptionElement[] = this.element.nativeElement.querySelectorAll('.selectTopValues');
    const productTopId = `top${this.productToUpdate.productTop.id}`;
    HtmlTopOptionElement.forEach((option) => {
      if (option.id === productTopId) {
        this.selectTopElement.nativeElement.value = option.value;
      }
    });
    const HtmlBottomOptionElement: HTMLOptionElement[] = this.element.nativeElement.querySelectorAll('.selectBottomValues');
    const productBottomId = `bottom${this.productToUpdate.productBottom.id}`;
    HtmlBottomOptionElement.forEach((option) => {
      if (option.id === productBottomId) {
        this.selectBottomElement.nativeElement.value = option.value;
      }
    });
  }

  createNewOrChangeDrawingClicked(): boolean {
    if (this.operationMode === ProductModeEnum.CREATENEW || this.changeDrawingClicked) {
      return true;
    } else {
      return false;
    }
  }

  showChangeDrawingButton(): boolean {
    if (this.operationMode === ProductModeEnum.UPDATE && !this.file.value) {
      return true;
    } else {
      return false;
    }
  }

  onDrawingCHangeForUpdate(): void {
    this.changeDrawingClicked = true;
  }

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {
  }

  allowSubmit(): boolean {
    if (this.operationMode === ProductModeEnum.CREATENEW) {
      if (this.form.valid && this.uploadSuccessStatus === true) {
        return true;
      } else {
        return false;
      }
    } else if (this.operationMode === ProductModeEnum.UPDATE && this.changeDrawingClicked === false) {
      if (this.form.valid) {
        return true;
      } else {
        return false;
      }
    }
    else if (this.operationMode === ProductModeEnum.UPDATE && this.changeDrawingClicked === true) {
      if (this.form.valid && this.uploadSuccessStatus === true) {
        return true;
      } else {
        return false;
      }
    }
  }
  getNameInSelectedLanguage(localizedNames: LocalizedName[]): string {
    return getSelectedLanguageFromNamesInAllLanguages(localizedNames, this.authenticationService.selectedLanguageCode);
  }
}
