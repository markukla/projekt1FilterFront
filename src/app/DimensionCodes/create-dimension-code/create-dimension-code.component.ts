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
  allDimensionRolesToSelect: DimensionRoleEnum[] = [DimensionRoleEnum.FIRSTINDEXDIMENSION, DimensionRoleEnum.SECONDINDEXDIMENSION, DimensionRoleEnum.NOINDEXDIMENSION];
  firstIndexDimensionRole = 'Pierwszy wymiar Indeksu';
  secondIndexDimensionRole = 'Drugi wymiar indeksu';
  noIndexDimensionRole = 'Nie wchodzi do Indeksu';
  createDimensionCodeDto: CreateDimensionCodeDto;
  localizedNames: LocalizedName[] = [];
  createdDimensinoCode: DimensionCode;
  recordToUpdate: DimensionCode;
  operatiomMode: string;
  @Output()
  createdDimensionEmiter: EventEmitter<DimensionCode>;
   selectedRecordToupdateId: string;
   languages: Language[];
  @ViewChildren('nameInput', {read: ElementRef}) languageNames: ElementRef[];
  constructor(
    private backendService: DimensionCodeBackendService,
    public validationService: ValidateDiemensionCodeService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private languageBackendService: LanguageBackendService,
    private router: Router) {
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
   if (this.operatiomMode === OperationModeEnum.UPDATE) {
     const foundRecord =  await this.backendService.findRecordById(this.selectedRecordToupdateId).toPromise();
     this.recordToUpdate = foundRecord.body;
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
    this.languageNames.forEach((languageInput) => {
      const localizedDimensionName: LocalizedName = {
        languageCode: languageInput.nativeElement.id,
        nameInThisLanguage: languageInput.nativeElement.value
      };
      localizedDimensionNames.push(localizedDimensionName);
    });
    this.createDimensionCodeDto = {
      localizedDimensionNames: localizedDimensionNames,
      dimensionCode: this.code.value,
      dimensionRole: this.role.value,
    };
    if(this.operatiomMode === OperationModeEnum.CREATENEW) {
      this.backendService.addRecords(this.createDimensionCodeDto).subscribe((material) => {
        this.showoperationStatusMessage = 'Dodano nowy rekord';
        this.createdDimensinoCode = material.body;
        this.createdDimensionEmiter.emit(this.createdDimensinoCode);
        this.cleanOperationMessage();
      }, error => {
        this.showoperationStatusMessage = 'Wystąpił bląd, nie udało się dodać nowego rekordu';
        this.cleanOperationMessage();
      });
    } else if (this.operatiomMode === OperationModeEnum.UPDATE) {
      this.backendService.updateRecordById(this.selectedRecordToupdateId, this.createDimensionCodeDto).subscribe((material) => {
        this.showoperationStatusMessage = 'Zaktualizowano rekord';
        this.createdDimensinoCode = material.body;
        this.createdDimensionEmiter.emit(this.createdDimensinoCode);
        this.cleanOperationMessage();
      }, error => {
        this.showoperationStatusMessage = 'Wystąpił bląd, nie udało się zaktulizować rekordu';
        this.cleanOperationMessage();
      });
    }
  }
  closeAndGoBack(): void {
    this.router.navigateByUrl('/products/types');
  }

  cleanOperationMessage(): void {
    setTimeout(() => {
      this.showoperationStatusMessage = null;
    }, 2000);
  }

  setValueForLanguageInputInUpdateMode(inputIdEqualContryCode: string, localizedNames: LocalizedName[]):string {
let name = '';
if (localizedNames && this.operatiomMode === OperationModeEnum.UPDATE) {
localizedNames.forEach((lozalizedName) => {
  if (lozalizedName.languageCode === inputIdEqualContryCode) {
    name = lozalizedName.nameInThisLanguage;
  }
});
}
return name;
  }
}
