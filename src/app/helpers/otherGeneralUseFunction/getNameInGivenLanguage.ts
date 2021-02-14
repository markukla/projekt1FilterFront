import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import {VocabularyForTableCell} from "../../Vocablulaty/VocabularyTypesAndClasses/VocabularyForTableCell";

export const getSelectedLanguageFromNamesInAllLanguages = (localizedNames: LocalizedName[], selectedLanguageLang: string): string => {
  const localizedNameInGivenLanguage: LocalizedName[] = [];
  let name = '';
  if (localizedNames && localizedNames.length > 0) {
    localizedNames.forEach((localizedName) => {
      if (localizedName.languageCode === selectedLanguageLang) {
        localizedNameInGivenLanguage.push(localizedName);
      }
    });
    name = localizedNameInGivenLanguage[0].nameInThisLanguage;
  }

  return name;
};


// tslint:disable-next-line:max-line-length
export const setTabelColumnAndOtherNamesForSelectedLanguage = (objectToSetPropertyInSelectedLanguage: any, vocabulariesInSelectedLanguage: VocabularyForTableCell[]) => {
   Object.keys(objectToSetPropertyInSelectedLanguage).forEach((key) => {
     vocabulariesInSelectedLanguage.forEach((vocabulary) => {
       if (key === vocabulary.variableName) {
         objectToSetPropertyInSelectedLanguage[key] = vocabulary.localizedNameInSelectedLanguage;
       }
     });
   });
};
