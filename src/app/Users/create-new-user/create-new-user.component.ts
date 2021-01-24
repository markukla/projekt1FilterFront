import { Component, OnInit } from '@angular/core';
import {MaterialBackendService} from '../../materials/MaterialServices/material-backend.service';
import {ValidateMaterialCodeUniqueService} from '../../materials/MaterialServices/validate-material-code-unique.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserBackendService} from '../UserServices/user-backend.service';
import {UserValidatorService} from '../UserServices/user-validator.service';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';

@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.css']
})
export class CreateNewUserComponent implements OnInit {

  operationStatusMessage: string;

  constructor(
    private authenticationService: AuthenticationService,
    private userBackendService: UserBackendService,
    public userValidatorService: UserValidatorService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {

  }

  // @ts-ignore
  userForm = new FormGroup({
    // tslint:disable-next-line:max-line-length
    fulName: new FormControl('', [Validators.nullValidator, Validators.required]),
    // tslint:disable-next-line:max-line-length
    email: new FormControl('', {updateOn: 'change', validators: [Validators.nullValidator, Validators.required, Validators.email], asyncValidators: [this.userValidatorService.emailAsyncValidator()]}),
    // tslint:disable-next-line:max-line-length
    password: new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(8),  this.userValidatorService.patternValidator(/(?=(.*\d){2})/, { hasNumber: true }), this.userValidatorService.patternValidator(/[A-Z]/, { hasCapitalCase: true }), this.userValidatorService.patternValidator(/[a-z]/, { hasSmallCase: true })]),
    confirmPassword: new FormControl('', [Validators.required]),
    // tslint:disable-next-line:max-line-length
    active: new FormControl(false),
    // tslint:disable-next-line:max-line-length
    isAdmin: new FormControl(false)
  }, {updateOn: 'change', validators: [this.userValidatorService.passwordMatchValidator({NoPassswordMatch: true})]});

  // tslint:disable-next-line:typedef
  get fulName() {
    return this.userForm.get('fulName');
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
    this.userBackendService.addUsers(this.userForm.value).subscribe((user) => {
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
