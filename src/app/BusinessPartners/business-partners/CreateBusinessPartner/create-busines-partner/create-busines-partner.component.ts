import { Component, OnInit } from '@angular/core';
import {UserBackendService} from '../../../../Users/UserServices/user-backend.service';
import {UserValidatorService} from '../../../../Users/UserServices/user-validator.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BusinesPartnerBackendService} from '../../BusinessPartnerServices/busines-partner-backend.service';
import {BusinessPartnerValidatorService} from '../../BusinessPartnerServices/business-partner-validator.service';
import {AuthenticationService} from '../../../../LoginandLogOut/AuthenticationServices/authentication.service';

@Component({
  selector: 'app-create-busines-partner',
  templateUrl: './create-busines-partner.component.html',
  styleUrls: ['./create-busines-partner.component.css']
})
export class CreateBusinesPartnerComponent implements OnInit {

  operationStatusMessage: string;
  constructor(
    private authenticationService: AuthenticationService,
    private bakcendService: BusinesPartnerBackendService,
    public validatorService: BusinessPartnerValidatorService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {

  }

  // @ts-ignore
  userForm = new FormGroup({
    // tslint:disable-next-line:max-line-length
    code: new FormControl('', [Validators.nullValidator, Validators.required]),
    businesPartnerCompanyName: new FormControl('', [Validators.nullValidator, Validators.required]),
    fulName: new FormControl('', [Validators.nullValidator, Validators.required]),
    // tslint:disable-next-line:max-line-length
    email: new FormControl('', {updateOn: 'change', validators: [Validators.nullValidator, Validators.required, Validators.email], asyncValidators: [this.validatorService.emailAsyncValidator()]}),
    // tslint:disable-next-line:max-line-length
    password: new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(8),  this.validatorService.patternValidator(/(?=(.*\d){2})/, { hasNumber: true }), this.validatorService.patternValidator(/[A-Z]/, { hasCapitalCase: true }), this.validatorService.patternValidator(/[a-z]/, { hasSmallCase: true })]),
    confirmPassword: new FormControl('', [Validators.required]),
    // tslint:disable-next-line:max-line-length
    active: new FormControl(false),
    // tslint:disable-next-line:max-line-length
  }, {updateOn: 'change', validators: [this.validatorService.passwordMatchValidator({NoPassswordMatch: true})]});

  // tslint:disable-next-line:typedef
  get fulName() {
    return this.userForm.get('fulName');
  }
  // tslint:disable-next-line:typedef
  get code() {
    return this.userForm.get('code');
  }
  // tslint:disable-next-line:typedef
  get businesPartnerCompanyName() {
    return this.userForm.get('businesPartnerCompanyName');
  }
  // tslint:disable-next-line:typedef
  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }

  // tslint:disable-next-line:typedef
  get email() {
    return this.userForm.get('email');
  }
  // tslint:disable-next-line:typedef
  get password() {
    return this.userForm.get('password');
  }
  // tslint:disable-next-line:typedef
  get active() {
    return this.userForm.get('active');
  }
  // tslint:disable-next-line:typedef
  get isAdmin() {
    return this.userForm.get('isAdmin');
  }


  onSubmit(): void {
    this.bakcendService.addOneRecord(this.userForm.value).subscribe((user) => {
      this.operationStatusMessage = 'Dodano nowego użytkownika';
      this.cleanOperationMessage();
      this.userForm.reset();
    }, error => {
      this.operationStatusMessage = 'Wystąpił bląd, nie udało się dodać nowego użytkownika';
      this.cleanOperationMessage();
    });
  }
  closeAndGoBack(): void {
    this.router.navigateByUrl(this.authenticationService._previousUrl);
  }

  ngOnInit(): void {
  }
  cleanOperationMessage(): void {
    setTimeout(() => {
      this.operationStatusMessage = null;
    }, 2000);
  }


}
