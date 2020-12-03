import { Component, OnInit } from '@angular/core';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductTopTableService} from '../../ProductTop/ProductTopServices/product-top-table.service';
import {ProductTopBackendService} from '../../ProductTop/ProductTopServices/product-top-backend.service';
import {ValidateProductTopService} from '../../ProductTop/ProductTopServices/validate-product-top.service';
import {Router} from '@angular/router';
import ProductBottom from '../../ProductTypesAndClasses/productBottom.entity';

@Component({
  selector: 'app-update-product-bottom',
  templateUrl: './update-product-bottom.component.html',
  styleUrls: ['./update-product-bottom.component.css']
})
export class UpdateProductBottomComponent implements OnInit {
  operationStatusMessage: string;
  recordToUpdate: ProductBottom;
  recordToUpdateId: number = this.tableService.selectedId;
  form = new FormGroup({
    // tslint:disable-next-line:max-line-length
    name: new FormControl('', [Validators.nullValidator, Validators.required], [this.validationService.nameValidatorForUpdate(String(this.recordToUpdateId))]),
    // tslint:disable-next-line:max-line-length
    code: new FormControl('', [Validators.nullValidator && Validators.required, Validators.minLength(1), Validators.maxLength(1)], [this.validationService.codeValidatorForUpdate(String(this.recordToUpdateId))]),
  }, {updateOn: 'change'});

  constructor(private tableService: ProductTopTableService,
              private backendService: ProductTopBackendService,
              private validationService: ValidateProductTopService,
              private router: Router) {
  }

  // tslint:disable-next-line:typedef
  get  name() {
    return this.form.get('name');
  }

  // tslint:disable-next-line:typedef
  get code() {
    return this.form.get('code');
  }

  ngOnInit(): void {
    console.log(`materialToUpdateId= ${this.recordToUpdateId}`);
    this.backendService.findRecordById(String(this.recordToUpdateId)).subscribe((record) => {
        this.recordToUpdate = record.body;
        this.name.setValue(record.body.name);
        this.code.setValue(record.body.code); },
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


}
