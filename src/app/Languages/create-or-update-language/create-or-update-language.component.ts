import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import ProductBottom from '../../Products/ProductTypesAndClasses/productBottom.entity';
import ProductTop from '../../Products/ProductTypesAndClasses/productTop.entity';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import DimensionRoleEnum from '../../DimensionCodes/DimensionCodesTypesAnClasses/dimensionRoleEnum';
import CreateDimensionCodeDto from '../../DimensionCodes/DimensionCodesTypesAnClasses/createDimensionCode.dto';
import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import DimensionCode from '../../DimensionCodes/DimensionCodesTypesAnClasses/diemensionCode.entity';
import {DimensionCodeBackendService} from '../../DimensionCodes/DimensionCodeServices/dimension-code-backend.service';
import {ValidateDiemensionCodeService} from '../../DimensionCodes/DimensionCodeServices/validate-diemension-code.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageDto} from '../LanguageTypesAndClasses/languageDto';
import {LanguageBackendService} from '../languageServices/language-backend.service';
import {ValidateLanguageService} from '../languageServices/validate-language.service';
import {SearchService} from '../../helpers/directive/SearchDirective/search.service';
import Language from '../LanguageTypesAndClasses/languageEntity';

@Component({
  selector: 'app-create-or-update-language',
  templateUrl: './create-or-update-language.component.html',
  styleUrls: ['./create-or-update-language.component.css']
})
export class CreateOrUpdateLanguageComponent implements OnInit {

  operationMessage: string;
  showoperationStatusMessage: string;
  allBotomsToselect: ProductBottom[];
  allTopsToSelect: ProductTop[];
  languageForm: FormGroup;
  createLanguageDto: LanguageDto;
  languageToUpdateId: string;
  languageToUpdate: Language;
  languageOperationMode: string;

  constructor(
    private backendService: LanguageBackendService,
    public validationService: ValidateLanguageService,
    private searchService: SearchService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params) => {
      this.languageToUpdateId = params.get('languageId');
      this.languageOperationMode = params.get('mode');
    });
    this.languageForm = new FormGroup({
      // tslint:disable-next-line:max-line-length
      languageCode: new FormControl('', [Validators.nullValidator, Validators.required]),
      // tslint:disable-next-line:max-line-length
      languageName: new FormControl('', [Validators.nullValidator && Validators.required]),
      active: new FormControl(false, [Validators.nullValidator && Validators.required])

    }, {updateOn: 'change'});
    await this.initFormValuesForUpdateMode();
  }

// tslint:disable-next-line:typedef
  get lamguageCode() {
    return this.languageForm.get('languageCode');
  }

  // tslint:disable-next-line:typedef
  get languageName() {
    return this.languageForm.get('languageName');
  }

  // tslint:disable-next-line:typedef
  get active() {
    return this.languageForm.get('active');
  }

  async initFormValuesForUpdateMode(): Promise<void> {
    if (this.languageOperationMode === 'update') {
      const foundRecord = await this.backendService.findRecordById(this.languageToUpdateId).toPromise();
      this.languageToUpdate = foundRecord.body;
      this.active.setValue(this.languageToUpdate.active);
      this.languageName.setValue(this.languageToUpdate.languageName);
      this.lamguageCode.setValue(this.languageToUpdate.languageCode);
    }
  }


  // tslint:disable-next-line:typedef
  onSubmit(): void {
    this.createLanguageDto = {
      languageCode: this.lamguageCode.value,
      languageName: this.languageName.value,
      active: this.active.value
    };
    if (this.languageOperationMode === 'addNew') {
    this.backendService.addRecords(this.createLanguageDto).subscribe((language) => {
      this.showoperationStatusMessage = 'Dodano nowy rekord';
      this.cleanOperationMessage();
    }, error => {
      this.showoperationStatusMessage = 'Wystąpił bląd, nie udało się dodać nowego rekordu';
      this.cleanOperationMessage();
    });
    }
    else if ( this.languageOperationMode === 'update') {
      this.backendService.updateRecordById(this.languageToUpdateId, this.createLanguageDto).subscribe((language) => {
        this.showoperationStatusMessage = 'Zaktualizowano rekord';
        this.cleanOperationMessage();
      }, error => {
        this.showoperationStatusMessage = 'Wystąpił bląd, nie udało się dodać nowego rekordu';
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

}
