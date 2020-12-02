import { Component, OnInit } from '@angular/core';
import {MaterialBackendService} from '../../../materials/MaterialServices/material-backend.service';
import {ValidateMaterialCodeUniqueService} from '../../../materials/MaterialServices/validate-material-code-unique.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductTopBackendService} from '../ProductTopServices/product-top-backend.service';
import {ValidateProductTopService} from '../ProductTopServices/validate-product-top.service';

@Component({
  selector: 'app-create-product-top',
  templateUrl: './create-product-top.component.html',
  styleUrls: ['./create-product-top.component.css']
})
export class CreateProductTopComponent implements OnInit {
  operationMessage: string;
  showoperationStatusMessage: string;

  constructor(
    private backendService: ProductTopBackendService,
    public validationService: ValidateProductTopService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {

  }
  form = new FormGroup({
    // tslint:disable-next-line:max-line-length
    name: new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(6),   Validators.maxLength(6)], [this.validationService.codeValidator()]),
    // tslint:disable-next-line:max-line-length
    code: new FormControl('', [Validators.nullValidator && Validators.required], [this.validationService.nameValidator()]),
  }, {updateOn: 'change'});
// tslint:disable-next-line:typedef
  get  name() {
    return this.form.get('name');
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
    this.router.navigateByUrl('/products/tops');
  }

  ngOnInit(): void {
  }
  cleanOperationMessage(): void {
    setTimeout(() => {
      this.showoperationStatusMessage = null;
    }, 2000);
  }

}
