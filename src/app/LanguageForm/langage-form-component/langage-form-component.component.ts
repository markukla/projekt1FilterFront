import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  ViewChildren
} from '@angular/core';
import Language from '../../Languages/LanguageTypesAndClasses/languageEntity';
import {LanguageBackendService} from '../../Languages/languageServices/language-backend.service';
import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import OperationModeEnum from '../../util/OperationModeEnum';
import {LanguageFormService} from '../language-form.service';
import DimensionCode from '../../DimensionCodes/DimensionCodesTypesAnClasses/diemensionCode.entity';
import {ActivatedRoute} from '@angular/router';
import {API_URL} from '../../Config/apiUrl';

@Component({
  selector: 'app-langage-form-component',
  templateUrl: './langage-form-component.component.html',
  styleUrls: ['./langage-form-component.component.css']
})
export class LangageFormComponentComponent implements OnInit, AfterViewInit, AfterContentChecked, AfterViewChecked {
  namesInAllLanguages: LocalizedName[];
  languages: Language[];
  operationMode: string;
  selectedRecordToupdateId: string;
  apiUrl = API_URL;
  @ViewChildren('nameInput', {read: ElementRef}) languageNames: ElementRef[];
  constructor(
    private languageService: LanguageBackendService,
    private languageFormService: LanguageFormService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryParams) => {
      this.operationMode = (queryParams.get('mode'));
      this.selectedRecordToupdateId = queryParams.get('recordId');
    });
  }
  setValueForLanguageInputInUpdateMode(inputIdEqualContryCode: string, localizedNames: LocalizedName[]): string {
    let name = '';
    if (localizedNames && this.operationMode === OperationModeEnum.UPDATE) {
      localizedNames.forEach((lozalizedName) => {
        if (lozalizedName.languageCode === inputIdEqualContryCode) {
          name = lozalizedName.nameInThisLanguage;
        }
      });
    }
    return name;
  }

  ngAfterViewInit(): void {
    /* it has to be here because this.alnguageNames is a table of element Referenced which is created after view init*/
    this.languageFormService.languageNames = this.languageNames;

  }

  ngAfterContentChecked(): void {
    /* does not work properly in ng onInit cause service value is not initialized yet*/
    this.namesInAllLanguages = this.languageFormService.namesInAllLanguages;
    this.languages = this.languageFormService.languages;
  }

  ngAfterViewChecked(): void {
  }
}

