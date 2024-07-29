import { TranslateService } from '@ngx-translate/core';
export type SxmLanguages = 'en-CA' | 'en-US' | 'fr-CA';

/**
 * @deprecated Use LanguageResources from @de-care/shared/translation instead
 */
export type LanguageResources = {
    [language in SxmLanguages]: object;
};

/**
 * @deprecated Use ModuleWithTranslation from @de-care/shared/translation instead
 */
export abstract class ModuleWithTranslation {
    private _loadedLanguages: { [language in SxmLanguages]?: boolean } = {};
    protected constructor(translateService: TranslateService, languageResources: LanguageResources) {
        // TODO: Consider using settingsService.isCanadaMode to determine if we should add the non US translations here.
        //       See comment in PackageDescriptionsTranslationsService for more info...
        for (const lang in languageResources) {
            if (languageResources[lang]) {
                translateService.setTranslation(lang, languageResources[lang], true);
                this._loadedLanguages[lang] = true;
            }
        }
    }
}
