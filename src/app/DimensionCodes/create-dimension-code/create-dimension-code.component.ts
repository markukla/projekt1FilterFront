import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
  languageForm: FormGroup;
  allDimensionRolesToSelect: DimensionRoleEnum[] = [DimensionRoleEnum.FIRSTINDEXDIMENSION, DimensionRoleEnum.SECONDINDEXDIMENSION, DimensionRoleEnum.NOINDEXDIMENSION];
  firstIndexDimensionRole = 'Pierwszy wymiar Indeksu';
  secondIndexDimensionRole = 'Drugi wymiar indeksu';
  noIndexDimensionRole = 'Nie wchodzi do Indeksu';
  createDimensionCodeDto: CreateDimensionCodeDto;
  localizedNames: LocalizedName[] = [];
  createdDimensinoCode: DimensionCode;
  @Output()
  createdDimensionEmiter: EventEmitter<DimensionCode>;
  constructor(
    private backendService: DimensionCodeBackendService,
    public validationService: ValidateDiemensionCodeService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
    console.log('creating component:CreateProductTypeComponent');
    this.getDataToDropdownLists();
    this.createdDimensionEmiter = new EventEmitter<DimensionCode>();

  }

  ngOnInit(): void {
    this.createdDimensionEmiter = new EventEmitter<DimensionCode>();
    this.form = new FormGroup({
      // tslint:disable-next-line:max-line-length
      role: new FormControl('', [Validators.nullValidator, Validators.required]),
      // tslint:disable-next-line:max-line-length
      code: new FormControl('', [Validators.nullValidator && Validators.required], [this.validationService.codeValidator()]),

    }, {updateOn: 'change'});
    this.languageForm = new FormGroup({
      // tslint:disable-next-line:max-line-length
      languageCode: new FormControl('', [Validators.nullValidator, Validators.required]),
      // tslint:disable-next-line:max-line-length
      nameInThisLanguage: new FormControl('', [Validators.nullValidator && Validators.required])

    }, {updateOn: 'change'});

  }
// tslint:disable-next-line:typedef
  get  lamguageCode() {
    return this.languageForm.get('languageCode');
  }
  // tslint:disable-next-line:typedef
  get  nameInThisLanguage() {
    return this.languageForm.get('nameInThisLanguage');
  }
  // tslint:disable-next-line:typedef
  get  role() {
    return this.form.get('role');
  }
  getDataToDropdownLists(): void {
  }


  // tslint:disable-next-line:typedef
  get code() {
    return this.form.get('code');
  }
  onSubmit(): void {
    this.createDimensionCodeDto = {
      localizedDimensionNames: this.localizedNames,
      dimensionCode: this.code.value,
      dimensionRole: this.role.value,
    };
    this.backendService.addRecords(this.createDimensionCodeDto).subscribe((material) => {
      this.showoperationStatusMessage = 'Dodano nowy rekord';
      this.createdDimensinoCode = material.body;
      this.createdDimensionEmiter.emit(this.createdDimensinoCode);
      this.cleanOperationMessage();
    }, error => {
      this.showoperationStatusMessage = 'Wystąpił bląd, nie udało się dodać nowego rekordu';
      this.cleanOperationMessage();
    });
  }
  closeAndGoBack(): void {
    this.router.navigateByUrl('/products/types');
  }

  cleanOperationMessage(): void {
    setTimeout(() => {
      this.showoperationStatusMessage = null;
    }, 2000);
  }

  addLanguageToCreateDto(): void {
    this.localizedNames.push(this.languageForm.value);
  }
}
