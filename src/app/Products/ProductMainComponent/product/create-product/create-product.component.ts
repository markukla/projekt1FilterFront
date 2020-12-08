import {AfterContentChecked, Component, OnInit} from '@angular/core';
import ProductBottom from '../../../ProductTypesAndClasses/productBottom.entity';
import ProductTop from '../../../ProductTypesAndClasses/productTop.entity';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductTypeBackendService} from '../../../ProductType/ProductTypeServices/product-type-backend.service';
import {ValidateProductTypeService} from '../../../ProductType/ProductTypeServices/validate-product-type.service';
import {ProductTopBackendService} from '../../../ProductTop/ProductTopServices/product-top-backend.service';
import {ProductBottomBackendService} from '../../../ProductBottom/ProductBottomServices/product-bottom-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import ProductType from '../../../ProductTypesAndClasses/productType.entity';
import {ProductBackendService} from '../ProductServices/product-backend.service';
import {ProductValidatorService} from '../ProductServices/product-validator.service';
import {DrawingPaths} from '../../../ProductTypesAndClasses/drawingPaths';
import {ProductComunicationService} from '../ProductServices/product-comunication.service';
import {getBackendErrrorMesage} from '../../../../helpers/errorHandlingFucntion/handleBackendError';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit, AfterContentChecked {
  operationMessage: string;
  uploadOperationMessage: string;
  showoperationStatusMessage: string;
  allBotomsToselect: ProductBottom[];
  allTopsToSelect: ProductTop[];
  allTypesToSelect: ProductType[];
  form: FormGroup;
  upladDrawingForm: FormGroup;
  drawingPaths: DrawingPaths;

  constructor(
    private backendService: ProductBackendService,
    public validationService: ProductValidatorService,
    private typesBackendService: ProductTypeBackendService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
    this.getDataToDropdownLists();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      type: new FormControl(null, [Validators.required] ),
      top: new FormControl(null, [Validators.required] ),
      bottom: new FormControl(null, [Validators.required])
    }, {updateOn: 'change'});
    this.upladDrawingForm = new FormGroup({
      file: new FormControl('', Validators.required),
      fileSource: new FormControl('', [Validators.required])
    });

  }
// tslint:disable-next-line:typedef
  get  top() {
    return this.form.get('top');
  }
  // tslint:disable-next-line:typedef
  get  type() {
    return this.form.get('type');
  }
  // tslint:disable-next-line:typedef
  get  fileSource() {
    return this.form.get('fileSource');
  }
  // tslint:disable-next-line:typedef
  get  bottom() {
    return this.form.get('bottom');
  }
  // tslint:disable-next-line:typedef
  get  file() {
    return this.upladDrawingForm.get('file');
  }
  getDataToDropdownLists(): void {
    this.typesBackendService.getRecords().subscribe((records) => {
      this.allTypesToSelect = records.body;
    }, error => {
      console.log('error during requesting productTypes');
    });
  }
  setTopsAndBottomsToSelectAfterTypeSelected(productType: ProductType): void {
    this.allTopsToSelect = productType.topsForThisProductType;
    this.allBotomsToselect = productType.bottomsForThisProductType;
  }
  onSubmit(): void {
    this.backendService.selectedType = this.type.value;
    this.backendService.selectedBottom = this.bottom.value;
    this.backendService.selectedTop = this.top.value;
    this.router.navigateByUrl('/products/addDrawing');
  }
  onUpload(): void {
    const formData = new FormData();
    formData.append('file', this.upladDrawingForm.get('fileSource').value);
    this.backendService.uploadDrawing(formData).subscribe((urls) => {
      this.backendService.drawingPaths = urls;
      console.log(`this.backendService.drawingPaths.urlOfOrginalDrawing= ${this.backendService.drawingPaths.urlOfOrginalDrawing} `);
      this.uploadOperationMessage = 'dodano rysunek';
    }, error => {
      const errorMessage = getBackendErrrorMesage(error);
      if (errorMessage.includes('.png files are allowed')) {
        this.uploadOperationMessage = 'nie udało sie dodać rysunku, tylko format .png jest dozwolony';
      }
      else {
        this.uploadOperationMessage = 'wystąpił błąd nie udało się dodać rysunku, spróbuj pownownie';
      }
    });

  }
  onFileChange(event): void {
    if (event.target.files.length > 0) {
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
    const type = this.type.value;
    console.log(`selected type= ${type}`);
    if (type) {
      this.backendService.selectedType = type;
      this.setTopsAndBottomsToSelectAfterTypeSelected(this.backendService.selectedType);
    }
  }

}
