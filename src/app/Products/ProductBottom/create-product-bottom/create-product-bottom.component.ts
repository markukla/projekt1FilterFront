import { Component, OnInit } from '@angular/core';
import {ProductTopBackendService} from '../../ProductTop/ProductTopServices/product-top-backend.service';
import {ValidateProductTopService} from '../../ProductTop/ProductTopServices/validate-product-top.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductBottomBackendService} from '../ProductBottomServices/product-bottom-backend.service';
import {ProductBottomValidatorService} from '../ProductBottomServices/product-bottom-validator.service';

@Component({
  selector: 'app-create-product-bottom',
  templateUrl: './create-product-bottom.component.html',
  styleUrls: ['./create-product-bottom.component.css']
})
export class CreateProductBottomComponent implements OnInit {
  operationMessage: string;
  showoperationStatusMessage: string;

  constructor(
    private backendService: ProductBottomBackendService,
    public validationService: ProductBottomValidatorService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {

  }
  form = new FormGroup({
    // tslint:disable-next-line:max-line-length
    name: new FormControl('', [Validators.nullValidator, Validators.required], [this.validationService.nameValidator()]),
    // tslint:disable-next-line:max-line-length
    code: new FormControl('', [Validators.nullValidator && Validators.required, Validators.minLength(1), Validators.maxLength(1)], [this.validationService.codeValidator()]),
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
