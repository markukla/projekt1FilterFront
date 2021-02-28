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
import {VocabularyBackendServiceService} from '../../../Vocablulaty/VocabularyServices/vocabulary-backend-service.service';
import {Vocabulary} from '../../../Vocablulaty/VocabularyTypesAndClasses/VocabularyEntity';
import {API_URL} from '../../../Config/apiUrl';
import LogInDto from "../../authenticationTypesAndClasses/login.dto";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterContentChecked {

  operationMessage: string;
  showoperationMessage: boolean;
  materialCreated: boolean;
  languages: Language [];
  activeLanguages: Language[];
  vocabularies: Vocabulary[];

  constructor(
    private loginBackendService: AuthenticationBackendService,
    public loginService: AuthenticationService,
    private vocabularyBackendService: VocabularyBackendServiceService,
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
      sessionStorage.setItem('loggedUser', JSON.stringify(logedUser.body));
      this.router.navigateByUrl('/orders');
    }, error => {
      const backendErrorMessage = getBackendErrrorMesage(error);
      if (backendErrorMessage.includes('wrong email or password')) {
        this.operationMessage = `Nieprawidłowy email lub hasło`;
      } else if (backendErrorMessage.includes('your account is inactive')) {
        this.operationMessage = `Twoje konto jest nieaktywne, skontaktuj się z administratorem.`;
      } else {
        this.operationMessage = `Wystąpił błąd. Spróbuj ponownie`;
      }
    });
  }

  closeAndGoBack(): void {
  }

  async ngOnInit(): Promise<void> {
    const languages = await this.languageBackendService.getRecords().toPromise();
    const vocabularies = await this.vocabularyBackendService.getRecords().toPromise();
    this.languages = languages.body;
    this.activeLanguages = this.languages.filter(language =>
      language.active === true);
    this.loginService.languages = languages.body;
    this.vocabularies = vocabularies.body;
    this.loginService.selectedLanguageCode = 'PL';
    this.loginService.vocabulariesInSelectedLanguage = [];
    // tslint:disable-next-line:max-line-length
    this.loginService.setSelectedLanguageCodeAndVocabullaryTableInSelectedLanguage(this.loginService.selectedLanguageCode, this.vocabularies);
    if (this.loginService.loggedUser && this.loginService.tokenData && this.loginService.selectedLanguageCode && this.loginService.vocabulariesInSelectedLanguage) {
      this.router.navigateByUrl('orders');
    }
  }

  ngAfterContentChecked(): void {
  }

  getFlagUrl(language: Language): string {
    const flagUlr = API_URL + language.flagUrl;
    return flagUlr;

  }
}
