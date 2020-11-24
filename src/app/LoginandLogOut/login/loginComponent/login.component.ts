import { Component, OnInit } from '@angular/core';
import {MaterialTableService} from '../../../material-table.service';
import {ValidateMaterialCodeUniqueService} from '../../../validate-material-code-unique.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationBackendService} from '../../AuthenticationServices/authentication.backend.service';
import {AuthenticationService} from '../../AuthenticationServices/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  operationMessage: string;
  showoperationMessage: boolean;
  materialCreated: boolean;

  constructor(
    private loginBackendService: AuthenticationBackendService,
    private loginService: AuthenticationService,
    public validateMaterialCodeUniqueService: ValidateMaterialCodeUniqueService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {

  }

  loginForm = new FormGroup({
    // tslint:disable-next-line:max-line-length
    email: new FormControl('', [Validators.nullValidator, Validators.required, /*Validators.minLength(6),*/   Validators.email]),
    password: new FormControl('', Validators.nullValidator && Validators.required),
  }, {updateOn: 'blur'}); /*blur means if user clicks outside the control*/

  // tslint:disable-next-line:typedef
  get email() {
    return this.loginForm.get('email');
  }

  // tslint:disable-next-line:typedef
  get password() {
    return this.loginForm.get('password' +
      '');
  }


  async onSubmit(): Promise<void> {
    console.log('on submit execution');
    this.showoperationMessage = true;
    this.loginBackendService.login(this.loginForm.value).subscribe((logedUser) => {
      this.loginService.setLogedUserUserAndToken(logedUser.body);
      this.operationMessage = 'you are logged in';
    }, error => {
      this.operationMessage = `Wrong email or password= ${error.message}`;
    });
    setTimeout(() => {
      this.showoperationMessage = false;
      this.router.navigateByUrl('/materials');
    }, 1000);
  }
  closeAndGoBack(): void {
  }

  ngOnInit(): void {
  }
}
