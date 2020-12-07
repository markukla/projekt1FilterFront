import { Component, OnInit } from '@angular/core';
import ProductTop from '../../../ProductTypesAndClasses/productTop.entity';
import ProductBottom from '../../../ProductTypesAndClasses/productBottom.entity';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductTypeTableService} from '../../../ProductType/ProductTypeServices/product-type-table.service';
import {ProductTypeBackendService} from '../../../ProductType/ProductTypeServices/product-type-backend.service';
import {ProductTopBackendService} from '../../../ProductTop/ProductTopServices/product-top-backend.service';
import {ProductBottomBackendService} from '../../../ProductBottom/ProductBottomServices/product-bottom-backend.service';
import {ValidateProductTypeService} from '../../../ProductType/ProductTypeServices/validate-product-type.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  operationStatusMessage: string;
  recordToUpdate: ProductTop;
  recordToUpdateId: number = this.tableService.selectedId;
  allBotomsToselect: ProductBottom[];
  allTopsToSelect: ProductTop[];
  form: FormGroup;

  constructor(private tableService: ProductTypeTableService,
              private backendService: ProductTypeBackendService,
              private topsBackendService: ProductTopBackendService,
              private bottomsBackendService: ProductBottomBackendService,
              private validationService: ValidateProductTypeService,
              private router: Router) {
    this.getDataToDropdownLists();
  }

  // tslint:disable-next-line:typedef
  get  name() {
    return this.form.get('name');
  }

  // tslint:disable-next-line:typedef
  get code() {
    return this.form.get('code');
  }
  // tslint:disable-next-line:typedef
  get  topsForThisProductType() {
    return this.form.get('topsForThisProductType');
  }
  // tslint:disable-next-line:typedef
  get  bottomsForThisProductType() {
    return this.form.get('bottomsForThisProductType');
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      // tslint:disable-next-line:max-line-length
      name: new FormControl('', [Validators.nullValidator, Validators.required], [this.validationService.nameValidatorForUpdate(String(this.recordToUpdateId))]),
      // tslint:disable-next-line:max-line-length
      code: new FormControl('', [Validators.nullValidator && Validators.required, Validators.minLength(1), Validators.maxLength(1)], [this.validationService.codeValidatorForUpdate(String(this.recordToUpdateId))]),
      topsForThisProductType: new FormControl(null, [Validators.required] ),
      bottomsForThisProductType: new FormControl(null, [Validators.required])
    }, {updateOn: 'change'});
    console.log(`materialToUpdateId= ${this.recordToUpdateId}`);
    this.backendService.findRecordById(String(this.recordToUpdateId)).subscribe((record) => {
        this.recordToUpdate = record.body;
        this.name.setValue(record.body.name);
        this.code.setValue(record.body.code);
        this.bottomsForThisProductType.setValue(record.body.bottomsForThisProductType);
        this.topsForThisProductType.setValue((record.body.topsForThisProductType)); },
      error => {
        console.log(`Wystąpił błąd spróbuj pownownie}`);
      });
  }


  onSubmit(): void {
    // tslint:disable-next-line:max-line-length
    console.log(`materialFOrrmValu= ${this.form.value}`);
    // tslint:disable-next-line:max-line-length
    this.backendService.updateRecordById(String(this.tableService.selectedId), this.form.value).subscribe((record) => {
        this.operationStatusMessage = 'pomyślnie zaktualizowano';
        this.resetMaterialFormValueAndOperationStatus();
      }, error => {
        this.operationStatusMessage = 'Wystąpił błąd, aktualizacja niepomyślna ';
        this.resetMaterialFormValueAndOperationStatus();
      }
    );


  }
  resetMaterialFormValueAndOperationStatus(): void {
    setTimeout(() => {
      this.form.reset();
      this.operationStatusMessage = '';
    }, 1500);
  }
  closeAndGoBack(): void {
    this.router.navigateByUrl('/products/tops');
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


}
