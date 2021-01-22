import {AfterContentChecked, Component, OnInit} from '@angular/core';
import {MaterialTableService} from '../../../materials/MaterialServices/material-table.service';
import {ValidateMaterialCodeUniqueService} from '../../../materials/MaterialServices/validate-material-code-unique.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationBackendService} from '../../AuthenticationServices/authentication.backend.service';
import {AuthenticationService} from '../../AuthenticationServices/authentication.service';
import {getBackendErrrorMesage} from '../../../helpers/errorHandlingFucntion/handleBackendError';
import {LanguageBackendService} from '../../../Languages/languageServices/language-backend.service';
import Language from '../../../Languages/LanguageTypesAndClasses/languageEntity';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterContentChecked{

  operationMessage: string;
  showoperationMessage: boolean;
  materialCreated: boolean;
   languages: Language [];
   activeLanguages: Language[];

  constructor(
    private loginBackendService: AuthenticationBackendService,
    private loginService: AuthenticationService,
    private languageBackendService: LanguageBackendService,
    public validateMaterialCodeUniqueService: ValidateMaterialCodeUniqueService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {

  }

  loginForm = new FormGroup({
    // tslint:disable-next-line:max-line-length
    email: new FormControl('', [Validators.nullValidator, Validators.required, /*Validators.minLength(6),*/   Validators.email]),
    password: new FormControl('', Validators.nullValidator && Validators.required),
  }, {updateOn: 'change'}); /*blur means if user clicks outside the control*/

  // tslint:disable-next-line:typedef
  get email() {
    return this.loginForm.get('email');
  }

  // tslint:disable-next-line:typedef
  get password() {
    return this.loginForm.get('password');
  }


  async onSubmit(): Promise<void> {
    console.log('on submit execution');
    this.showoperationMessage = true;
    this.loginBackendService.login(this.loginForm.value).subscribe((logedUser) => {
      this.loginService.setLogedUserUserAndToken(logedUser.body);
      this.router.navigateByUrl('/orders');
    }, error => {
      const backendErrorMessage = getBackendErrrorMesage(error);
      if (backendErrorMessage.includes('wrong email or password')) {
        this.operationMessage = `Nieprawidłowy email lub hasło`;
      }
      else if (backendErrorMessage.includes('your account is inactive')) {
        this.operationMessage = `Twoje konto jest nieaktywne, skontaktuj się z administratorem.`;
      }
      else {
        this.operationMessage = `Wystąpił błąd. Spróbuj ponownie`;
      }
    });
  }
  closeAndGoBack(): void {
  }

 async ngOnInit(): Promise<void> {
  const languages = await this.languageBackendService.getRecords().toPromise();
  this.languages = languages.body;
  this.activeLanguages = this.languages.filter(language =>
    language.active === true );
  this.loginService.languages = languages.body;
  }

  ngAfterContentChecked(): void {
  }

  setSelectedLanguageCode(languageCode: string) {
    this.loginService.selectedLanguageCode = languageCode;
  }
}
