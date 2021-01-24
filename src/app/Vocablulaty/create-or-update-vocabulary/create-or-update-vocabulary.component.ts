import { Component, OnInit } from '@angular/core';
import ProductBottom from '../../Products/ProductTypesAndClasses/productBottom.entity';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import CreateProductTopDto from '../../Products/ProductTypesAndClasses/createProductTop.dto';
import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import Language from '../../Languages/LanguageTypesAndClasses/languageEntity';
import {ProductTopBackendService} from '../../Products/ProductTop/ProductTopServices/product-top-backend.service';
import {ValidateProductTopService} from '../../Products/ProductTop/ProductTopServices/validate-product-top.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageBackendService} from '../../Languages/languageServices/language-backend.service';
import {BackendMessageService} from '../../helpers/ErrorHandling/backend-message.service';
import {LanguageFormService} from '../../LanguageForm/language-form.service';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';
import OperationModeEnum from '../../util/OperationModeEnum';
import {CreateVocabularyDto} from '../VocabularyTypesAndClasses/VocabularyDto';
import {Vocabulary} from '../VocabularyTypesAndClasses/VocabularyEntity';
import {VocabularyBackendServiceService} from '../VocabularyServices/vocabulary-backend-service.service';

@Component({
  selector: 'app-create-or-update-vocabulary',
  templateUrl: './create-or-update-vocabulary.component.html',
  styleUrls: ['./create-or-update-vocabulary.component.css']
})
export class CreateOrUpdateVocabularyComponent implements OnInit {
  operationMessage: string;
  showoperationStatusMessage: string;
  form: FormGroup;
  createVocabularyDto: CreateVocabularyDto;
  localizedNames: LocalizedName[] = [];
  recordToUpdate: Vocabulary;
  selectedRecordToupdateId: string;
  operatiomMode: string;
  closeButtonDescription: string;
  addNewProductBottomDescription: string;
  productTopCodeDescription: string;
  thisFiledIsRequiredDescription: string;
  codeCanNotBeShortedThan3CharactersDescription: string;
  codeCanNotBeLongerThan3CharactersDescription: string;
  giveNameForAllLanguagesDescription: string;
  saveButtonDescription: string;
  languages: Language[];
  constructor(
    private backendService: VocabularyBackendServiceService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private languageBackendService: LanguageBackendService,
    private router: Router,
    private backendMessageService: BackendMessageService,
    private languageFormService: LanguageFormService,
    private authenticationService: AuthenticationService) {
    console.log('creating component:CreateProductTypeComponent');
  }
  async ngOnInit(): Promise<void> {
    this.route.queryParamMap.subscribe((queryParams) => {
      this.operatiomMode = (queryParams.get('mode'));
      this.selectedRecordToupdateId = queryParams.get('recordId');
    });
    this.form = new FormGroup({
      // tslint:disable-next-line:max-line-length
      code: new FormControl('', [Validators.nullValidator && Validators.required]),

    }, {updateOn: 'change'});
    await this.getInitDataFromBackend();
  }
  // tslint:disable-next-line:typedef
  get code() {
    return this.form.get('code');
  }
  async getInitDataFromBackend(): Promise<void> {
    this.languages = this.authenticationService.languages;
    this.languageFormService.languages = this.languages;
    if (this.operatiomMode === OperationModeEnum.UPDATE) {
      const foundRecord =  await this.backendService.findRecordById(this.selectedRecordToupdateId).toPromise();
      this.recordToUpdate = foundRecord.body;
      this.languageFormService.namesInAllLanguages = this.recordToUpdate.localizedNames;
      this.code.setValue(this.recordToUpdate.variableName);
    }
  }

  onSubmit(): void {
    const localizedNames: LocalizedName[] = [];
    this.languageFormService.languageNames.forEach((languageInput) => {
      const localizedDimensionName: LocalizedName = {
        languageCode: languageInput.nativeElement.id,
        nameInThisLanguage: languageInput.nativeElement.value
      };
      localizedNames.push(localizedDimensionName);
    });
    this.createVocabularyDto = {
      localizedNames,
      variableName: this.code.value,
    };
    if(this.operatiomMode === OperationModeEnum.CREATENEW) {
      this.backendService.addRecords(this.createVocabularyDto).subscribe((record) => {
        this.showoperationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponse();
        this.cleanOperationMessage();
      }, error => {
        this.showoperationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorString(error);
        this.cleanOperationMessage();
      });
    } else if (this.operatiomMode === OperationModeEnum.UPDATE) {
      this.backendService.updateRecordById(this.selectedRecordToupdateId, this.createVocabularyDto).subscribe((material) => {
        this.showoperationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponse();
        this.cleanOperationMessage();
      }, error => {
        this.showoperationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorString(error);
        this.cleanOperationMessage();
      });
    }
  }
  closeAndGoBack(): void {
    this.router.navigateByUrl(this.authenticationService._previousUrl);
  }

  cleanOperationMessage(): void {
    setTimeout(() => {
      this.showoperationStatusMessage = null;
    }, 2000);
  }
}
