import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';

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
