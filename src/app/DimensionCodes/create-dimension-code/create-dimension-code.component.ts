import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChildren} from '@angular/core';
import ProductBottom from '../../Products/ProductTypesAndClasses/productBottom.entity';
import ProductTop from '../../Products/ProductTypesAndClasses/productTop.entity';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DimensionCodeBackendService} from '../DimensionCodeServices/dimension-code-backend.service';
import {ValidateDiemensionCodeService} from '../DimensionCodeServices/validate-diemension-code.service';
import DimensionRoleEnum from '../DimensionCodesTypesAnClasses/dimensionRoleEnum';
import CreateDimensionCodeDto from '../DimensionCodesTypesAnClasses/createDimensionCode.dto';
import LocalizedName from '../DimensionCodesTypesAnClasses/localizedName';
import DimensionCode from '../DimensionCodesTypesAnClasses/diemensionCode.entity';
import OperationModeEnum from '../../util/OperationModeEnum';
import {LanguageBackendService} from '../../Languages/languageServices/language-backend.service';
import Language from '../../Languages/LanguageTypesAndClasses/languageEntity';
import {LanguageFormService} from '../../LanguageForm/language-form.service';
import BackendErrorResponse from '../../helpers/ErrorHandling/backendErrorResponse';
import {BackendMessageService} from '../../helpers/ErrorHandling/backend-message.service';

@Component({
  selector: 'app-create-dimension-code',
  templateUrl: './create-dimension-code.component.html',
  styleUrls: ['./create-dimension-code.component.css']
})
export class CreateDimensionCodeComponent implements OnInit {

  operationMessage: string;
  showoperationStatusMessage: string;
  allBotomsToselect: ProductBottom[];
  allTopsToSelect: ProductTop[];
  form: FormGroup;
  // tslint:disable-next-line:max-line-length
  allDimensionRolesToSelect: DimensionRoleEnum[] = [DimensionRoleEnum.FIRSTINDEXDIMENSION, DimensionRoleEnum.SECONDINDEXDIMENSION, DimensionRoleEnum.NOINDEXDIMENSION];
  firstIndexDimensionRole = 'Pierwszy wymiar Indeksu';
  secondIndexDimensionRole = 'Drugi wymiar indeksu';
  noIndexDimensionRole = 'Nie wchodzi do Indeksu';
  createDimensionCodeDto: CreateDimensionCodeDto;
  localizedNames: LocalizedName[] = [];
  createdDimensinoCode: DimensionCode;
  recordToUpdate: DimensionCode;
  operatiomMode: string;
  closeButtonDescription: string;
  addNewDimensionCodeDescription: string;
  dimensionCodeDescription: string;
  thisFiledIsRequiredDescription: string;
  codeCanNotBeShortedThan2CharactersDescription: string;
  codeCanNotBeLongerThan2CharactersDescription: string;
  SelectDimensionRoleDescription: string;
  giveNameForAllLanguagesDescription: string;
  saveButtonDescription: string;
  @Output()
  createdDimensionEmiter: EventEmitter<DimensionCode>;
   selectedRecordToupdateId: string;
   languages: Language[];
  constructor(
    private backendService: DimensionCodeBackendService,
    public validationService: ValidateDiemensionCodeService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private languageBackendService: LanguageBackendService,
    private router: Router,
    private backendMessageService: BackendMessageService,
    private languageFormService: LanguageFormService) {
    console.log('creating component:CreateProductTypeComponent');
    this.createdDimensionEmiter = new EventEmitter<DimensionCode>();
  }
  async ngOnInit(): Promise<void> {
    this.createdDimensionEmiter = new EventEmitter<DimensionCode>();
    this.route.queryParamMap.subscribe((queryParams) => {
      this.operatiomMode = (queryParams.get('mode'));
      this.selectedRecordToupdateId = queryParams.get('recordId');
    });
    this.form = new FormGroup({
      // tslint:disable-next-line:max-line-length
      role: new FormControl('', [Validators.nullValidator, Validators.required]),
      // tslint:disable-next-line:max-line-length
      code: new FormControl('', [Validators.nullValidator && Validators.required], [this.validationService.codeValidator()]),

    }, {updateOn: 'change'});
    await this.getInitDataFromBackend();
  }

  // tslint:disable-next-line:typedef
  get  role() {
    return this.form.get('role');
  }
  async getInitDataFromBackend(): Promise<void> {
   const foundLanguages =  await this.languageBackendService.getRecords().toPromise();
   this.languages = foundLanguages.body;
   this.languageFormService.languages = this.languages;
   if (this.operatiomMode === OperationModeEnum.UPDATE) {
     const foundRecord =  await this.backendService.findRecordById(this.selectedRecordToupdateId).toPromise();
     this.recordToUpdate = foundRecord.body;
     this.languageFormService.namesInAllLanguages = this.recordToUpdate.localizedDimensionNames;
     this.role.setValue(this.recordToUpdate.dimensionRole);
     this.code.setValue(this.recordToUpdate.dimensionCode);
    }
  }


  // tslint:disable-next-line:typedef
  get code() {
    return this.form.get('code');
  }
  onSubmit(): void {
    const localizedDimensionNames: LocalizedName[] = [];
    this.languageFormService.languageNames.forEach((languageInput) => {
      const localizedDimensionName: LocalizedName = {
        languageCode: languageInput.nativeElement.id,
        nameInThisLanguage: languageInput.nativeElement.value
      };
      localizedDimensionNames.push(localizedDimensionName);
    });
    this.createDimensionCodeDto = {
      localizedDimensionNames,
      dimensionCode: this.code.value,
      dimensionRole: this.role.value,
    };
    if(this.operatiomMode === OperationModeEnum.CREATENEW) {
      this.backendService.addRecords(this.createDimensionCodeDto).subscribe((material) => {
        this.showoperationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponse();
        this.createdDimensinoCode = material.body;
        this.createdDimensionEmiter.emit(this.createdDimensinoCode);
        this.cleanOperationMessage();
      }, error => {
        this.showoperationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorString(error);
        this.cleanOperationMessage();
      });
    } else if (this.operatiomMode === OperationModeEnum.UPDATE) {
      this.backendService.updateRecordById(this.selectedRecordToupdateId, this.createDimensionCodeDto).subscribe((material) => {
        this.showoperationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponse();
        this.createdDimensinoCode = material.body;
        this.createdDimensionEmiter.emit(this.createdDimensinoCode);
        this.cleanOperationMessage();
      }, error => {
        this.showoperationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorString(error);
        this.cleanOperationMessage();
      });
    }
  }
  closeAndGoBack(): void {
    this.router.navigateByUrl('/dimensionCodes');
  }

  cleanOperationMessage(): void {
    setTimeout(() => {
      this.showoperationStatusMessage = null;
    }, 2000);
  }

}
