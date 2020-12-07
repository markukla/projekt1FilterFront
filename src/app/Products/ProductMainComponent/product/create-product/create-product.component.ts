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
  selectedType: ProductType;
  selectedBottom: ProductBottom;
  selectedTop: ProductTop;
  form: FormGroup;
  upladDrawingForm: FormGroup;
  drawingPaths: DrawingPaths;

  constructor(
    private backendService: ProductBackendService,
    private comunicationService: ProductComunicationService,
    public validationService: ProductValidatorService,
    private typesBackendService: ProductTypeBackendService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
    this.getDataToDropdownLists();
    this.selectedType = this.comunicationService.selectedType;
    this.selectedTop = this.comunicationService.selectedTop;
    this.selectedBottom = this.comunicationService.selectedBottom;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      types: new FormControl(null, [Validators.required] ),
      topsForThisProductType: new FormControl(null, [Validators.required] ),
      bottomsForThisProductType: new FormControl(null, [Validators.required])
    }, {updateOn: 'change'});
    this.upladDrawingForm = new FormGroup({
      file: new FormControl('', Validators.required)
    });

  }
// tslint:disable-next-line:typedef
  get  topsForThisProductType() {
    return this.form.get('topsForThisProductType');
  }
  // tslint:disable-next-line:typedef
  get  types() {
    return this.form.get('types');
  }
  // tslint:disable-next-line:typedef
  get  bottomsForThisProductType() {
    return this.form.get('bottomsForThisProductType');
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
    this.backendService.addRecords(this.form.value).subscribe((material) => {
      this.showoperationStatusMessage = 'Dodano nowy rekord';
      this.cleanOperationMessage();
    }, error => {
      this.showoperationStatusMessage = 'Wystąpił bląd, nie udało się dodać nowego rekordu';
      this.cleanOperationMessage();
    });
  }
  onUpload(): void {
    this.backendService.uploadDrawing(this.upladDrawingForm.value).subscribe((urls) => {
      this.drawingPaths = urls;
      this.uploadOperationMessage = 'dodano rysunek';
    }, error => {
      this.uploadOperationMessage = 'nie udało sie dodać rysunku';
    });

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
    const type = this.types.value;
    console.log(`selected type= ${type}`);
    if (type) {
      this.selectedType = type;
      this.setTopsAndBottomsToSelectAfterTypeSelected(this.selectedType);
    }
  }

}
