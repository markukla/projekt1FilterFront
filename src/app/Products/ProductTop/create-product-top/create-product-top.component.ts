import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MaterialBackendService} from '../../../materials/MaterialServices/material-backend.service';
import {ValidateMaterialCodeUniqueService} from '../../../materials/MaterialServices/validate-material-code-unique.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductTopBackendService} from '../ProductTopServices/product-top-backend.service';
import {ValidateProductTopService} from '../ProductTopServices/validate-product-top.service';
import ProductBottom from '../../ProductTypesAndClasses/productBottom.entity';
import CreateProductBottomDto from '../../ProductTypesAndClasses/createProductBottom.dto';
import LocalizedName from '../../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import DimensionCode from '../../../DimensionCodes/DimensionCodesTypesAnClasses/diemensionCode.entity';
import Language from '../../../Languages/LanguageTypesAndClasses/languageEntity';
import {ProductBottomBackendService} from '../../ProductBottom/ProductBottomServices/product-bottom-backend.service';
import {ProductBottomValidatorService} from '../../ProductBottom/ProductBottomServices/product-bottom-validator.service';
import {LanguageBackendService} from '../../../Languages/languageServices/language-backend.service';
import {BackendMessageService} from '../../../helpers/ErrorHandling/backend-message.service';
import {LanguageFormService} from '../../../LanguageForm/language-form.service';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';
import OperationModeEnum from '../../../util/OperationModeEnum';
import CreateProductTopDto from '../../ProductTypesAndClasses/createProductTop.dto';

@Component({
  selector: 'app-create-product-top',
  templateUrl: './create-product-top.component.html',
  styleUrls: ['./create-product-top.component.css']
})
export class CreateProductTopComponent implements OnInit {

  operationMessage: string;
  showoperationStatusMessage: string;
  allBotomsToselect: ProductBottom[];
  form: FormGroup;
  createProductTopDto: CreateProductTopDto;
  localizedNames: LocalizedName[] = [];
  recordToUpdate: ProductBottom;
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
    private backendService: ProductTopBackendService,
    public validationService: ValidateProductTopService,
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
      code: new FormControl('', [Validators.nullValidator && Validators.required, Validators.maxLength(2), Validators.minLength(2)]),

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
      this.code.setValue(this.recordToUpdate.code);
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
    this.createProductTopDto = {
      localizedNames,
      code: this.code.value,
    };
    if(this.operatiomMode === OperationModeEnum.CREATENEW) {
      this.backendService.addRecords(this.createProductTopDto).subscribe((record) => {
        this.showoperationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponse();
        this.cleanOperationMessage();
      }, error => {
        this.showoperationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorString(error);
        this.cleanOperationMessage();
      });
    } else if (this.operatiomMode === OperationModeEnum.UPDATE) {
      this.backendService.updateRecordById(this.selectedRecordToupdateId, this.createProductTopDto).subscribe((material) => {
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
