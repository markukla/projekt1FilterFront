import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProductTopBackendService} from '../../ProductTop/ProductTopServices/product-top-backend.service';
import {ValidateProductTopService} from '../../ProductTop/ProductTopServices/validate-product-top.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductBottomBackendService} from '../ProductBottomServices/product-bottom-backend.service';
import {ProductBottomValidatorService} from '../ProductBottomServices/product-bottom-validator.service';
import ProductBottom from '../../ProductTypesAndClasses/productBottom.entity';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import DimensionRoleEnum from '../../../DimensionCodes/DimensionCodesTypesAnClasses/dimensionRoleEnum';
import CreateDimensionCodeDto from '../../../DimensionCodes/DimensionCodesTypesAnClasses/createDimensionCode.dto';
import LocalizedName from '../../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import DimensionCode from '../../../DimensionCodes/DimensionCodesTypesAnClasses/diemensionCode.entity';
import Language from '../../../Languages/LanguageTypesAndClasses/languageEntity';
import {DimensionCodeBackendService} from '../../../DimensionCodes/DimensionCodeServices/dimension-code-backend.service';
import {ValidateDiemensionCodeService} from '../../../DimensionCodes/DimensionCodeServices/validate-diemension-code.service';
import {LanguageBackendService} from '../../../Languages/languageServices/language-backend.service';
import {BackendMessageService} from '../../../helpers/ErrorHandling/backend-message.service';
import {LanguageFormService} from '../../../LanguageForm/language-form.service';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';
import OperationModeEnum from '../../../util/OperationModeEnum';
import CreateProductBottomDto from '../../ProductTypesAndClasses/createProductBottom.dto';

@Component({
  selector: 'app-create-product-bottom',
  templateUrl: './create-product-bottom.component.html',
  styleUrls: ['./create-product-bottom.component.css']
})
export class CreateProductBottomComponent implements OnInit {

  operationMessage: string;
  showoperationStatusMessage: string;
  allBotomsToselect: ProductBottom[];
  form: FormGroup;
  createProductBottomDto: CreateProductBottomDto;
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
  @Output()
  createdDimensionEmiter: EventEmitter<DimensionCode>;
  languages: Language[];
  constructor(
    private backendService: ProductBottomBackendService,
    public validationService: ProductBottomValidatorService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private languageBackendService: LanguageBackendService,
    private router: Router,
    private backendMessageService: BackendMessageService,
    private languageFormService: LanguageFormService,
    private authenticationService: AuthenticationService) {
    console.log('creating component:CreateProductTypeComponent');
    this.createdDimensionEmiter = new EventEmitter<DimensionCode>();
  }
  async ngOnInit(): Promise<void> {
    Object.keys(this).forEach(e => console.log(`key= ${e}, value= ${this[e]} `));
    this.createdDimensionEmiter = new EventEmitter<DimensionCode>();
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
    this.createProductBottomDto = {
       localizedNames,
      code: this.code.value,
    };
    if(this.operatiomMode === OperationModeEnum.CREATENEW) {
      this.backendService.addRecords(this.createProductBottomDto).subscribe((record) => {
        this.showoperationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponse();
        this.cleanOperationMessage();
      }, error => {
        this.showoperationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorString(error);
        this.cleanOperationMessage();
      });
    } else if (this.operatiomMode === OperationModeEnum.UPDATE) {
      this.backendService.updateRecordById(this.selectedRecordToupdateId, this.createProductBottomDto).subscribe((material) => {
        this.showoperationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponse();
        this.cleanOperationMessage();
      }, error => {
        this.showoperationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorString(error);
        this.cleanOperationMessage();
      });
    }
  }
  closeAndGoBack(): void {
    this.router.navigateByUrl('/products/bottoms');
  }

  cleanOperationMessage(): void {
    setTimeout(() => {
      this.showoperationStatusMessage = null;
    }, 2000);
  }

}
