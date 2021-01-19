import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';

export const getSelectedLanguageFromNamesInAllLanguages = (localizedNames: LocalizedName[], selectedLanguageLang: string): string => {
  const localizedNameInGivenLanguage: LocalizedName[] = [];
  localizedNames.forEach((localizedName) => {
    if (localizedName.languageCode === selectedLanguageLang) {
      localizedNameInGivenLanguage.push(localizedName);
    }
  });
  return localizedNameInGivenLanguage[0].nameInThisLanguage;
};
