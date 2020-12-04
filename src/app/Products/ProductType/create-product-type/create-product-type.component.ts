import { Component, OnInit } from '@angular/core';
import {ProductTopBackendService} from '../../ProductTop/ProductTopServices/product-top-backend.service';
import {ValidateProductTopService} from '../../ProductTop/ProductTopServices/validate-product-top.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductTypeBackendService} from '../ProductTypeServices/product-type-backend.service';
import {ValidateProductTypeService} from '../ProductTypeServices/validate-product-type.service';
import ProductBottom from '../../ProductTypesAndClasses/productBottom.entity';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import {ProductBottomBackendService} from '../../ProductBottom/ProductBottomServices/product-bottom-backend.service';
import {ProductBottomTableService} from '../../ProductBottom/ProductBottomServices/product-bottom-table.service';
import {ProductTopTableService} from '../../ProductTop/ProductTopServices/product-top-table.service';

@Component({
  selector: 'app-create-product-type',
  templateUrl: './create-product-type.component.html',
  styleUrls: ['./create-product-type.component.css']
})
export class CreateProductTypeComponent implements OnInit {
  operationMessage: string;
  showoperationStatusMessage: string;
  allBotomsToselect: ProductBottom[];
  allTopsToSelect: ProductTop[];
  form: FormGroup;

  constructor(
    private backendService: ProductTypeBackendService,
    public validationService: ValidateProductTypeService,
    private topsBackendService: ProductTopBackendService,
    private bottomsBackendService: ProductBottomBackendService,
    private bottomTableService: ProductBottomTableService,
    private topTableService: ProductTopTableService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
    console.log('creating component:CreateProductTypeComponent');
    this.getDataToDropdownLists();

  }

  ngOnInit(): void {
    this.allBotomsToselect = this.bottomTableService.getRecords();
    this.allBotomsToselect = this.topTableService.getRecords();
    this.form = new FormGroup({
      // tslint:disable-next-line:max-line-length
      name: new FormControl('', [Validators.nullValidator, Validators.required], [this.validationService.nameValidator()]),
      // tslint:disable-next-line:max-line-length
      code: new FormControl('', [Validators.nullValidator && Validators.required, Validators.minLength(1), Validators.maxLength(1)], [this.validationService.codeValidator()]),
      topsForThisProductType: new FormControl(null, [Validators.required] ),
      bottomsForThisProductType: new FormControl(null, [Validators.required])
    }, {updateOn: 'change'});

  }
// tslint:disable-next-line:typedef
  get  topsForThisProductType() {
    return this.form.get('topsForThisProductType');
  }
  // tslint:disable-next-line:typedef
  get  bottomsForThisProductType() {
    return this.form.get('bottomsForThisProductType');
  }
  // tslint:disable-next-line:typedef
  get  name() {
    return this.form.get('name');
  }
  getDataToDropdownLists(): void {
    this.topsBackendService.getRecords().subscribe((records) => {
      this.allTopsToSelect = records.body;
    }, error => {
      console.log('error during requesting productTops');
    });
    this.bottomsBackendService.getRecords().subscribe((records) => {
      this.allBotomsToselect = records.body;
    }, error => {
      console.log('error during requesting productBottoms');
    });
  }


  // tslint:disable-next-line:typedef
  get code() {
    return this.form.get('code');
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
  closeAndGoBack(): void {
    this.router.navigateByUrl('/products/types');
  }

  cleanOperationMessage(): void {
    setTimeout(() => {
      this.showoperationStatusMessage = null;
    }, 2000);
  }


}
