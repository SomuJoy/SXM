import { TranslateService } from '@ngx-translate/core';

export type SxmLanguages = 'en-CA' | 'en-US' | 'fr-CA';
export type LanguageResources = {
    [language in SxmLanguages]: object;
};

export abstract class ModuleWithTranslation {
    private _loadedLanguages: { [language in SxmLanguages]?: boolean } = {};
    protected constructor(translateService: TranslateService, languageResources: LanguageResources) {
        for (const lang in languageResources) {
            if (languageResources[lang]) {
                translateService.setTranslation(lang, languageResources[lang], true);
                this._loadedLanguages[lang] = true;
            }
        }
    }
}
