import {ElementRef, Injectable, ViewChildren} from '@angular/core';
import LocalizedName from '../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import Language from '../Languages/LanguageTypesAndClasses/languageEntity';

@Injectable({
  providedIn: 'root'
})
export class LanguageFormService {
  @ViewChildren('nameInput', {read: ElementRef}) languageNames: ElementRef[];
  namesInAllLanguages: LocalizedName[];
  languages: Language [];
  constructor() { }
}
