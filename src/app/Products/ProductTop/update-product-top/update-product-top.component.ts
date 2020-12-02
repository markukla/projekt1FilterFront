import { Component, OnInit } from '@angular/core';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MaterialTableService} from '../../../materials/MaterialServices/material-table.service';
import {MaterialBackendService} from '../../../materials/MaterialServices/material-backend.service';
import {Router} from '@angular/router';
import {getBackendErrrorMesage} from '../../../helpers/errorHandlingFucntion/handleBackendError';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import {ProductTopTableService} from '../ProductTopServices/product-top-table.service';
import {ProductTopBackendService} from '../ProductTopServices/product-top-backend.service';
import {ValidateProductTopService} from '../ProductTopServices/validate-product-top.service';

@Component({
  selector: 'app-update-product-top',
  templateUrl: './update-product-top.component.html',
  styleUrls: ['./update-product-top.component.css']
})
export class UpdateProductTopComponent implements OnInit {
  operationStatusMessage: string;
  recordToUpdate: ProductTop;
  recordToUpdateId: number;
  form = new FormGroup({
    // tslint:disable-next-line:max-line-length
    name: new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(6),   Validators.maxLength(6)], [this.validatorService.nameValidator()]),
    // tslint:disable-next-line:max-line-length
    code: new FormControl('', [Validators.nullValidator && Validators.required], [this.validatorService.codeValidator()]),
  }, {updateOn: 'change'});

  constructor(private tableService: ProductTopTableService,
              private backendService: ProductTopBackendService,
              private validatorService: ValidateProductTopService,
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
    this.recordToUpdateId = this.tableService.selectedId;
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
          this.operationStatusMessage = 'Wystąpił błąd, nie zaktualizowano materiału';
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
