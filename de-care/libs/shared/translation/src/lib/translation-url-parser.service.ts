import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class TranslationUrlParserService {
    private readonly _location: Location;

    constructor(private readonly _translateService: TranslateService, @Inject(DOCUMENT) readonly document: Document) {
        this._location = document?.location;
    }

    setLangFromUrlParam(newLanguage: string) {
        if (newLanguage) {
            const newLanguageKey = this._getNewLangMatch(newLanguage);
            if (newLanguageKey) {
                this._translateService.use(newLanguageKey);
            }
        }
    }

    private _getNewLangMatch(newLanguage: string): string | undefined {
        const [currentLanguage, currentCountry] = this._translateService.currentLang.split('-');
        if (currentLanguage.toLowerCase() === newLanguage.toLowerCase()) {
            return;
        }
        return this._translateService.langs.find((languageKey) => languageKey === `${newLanguage}-${currentCountry}`);
    }
}
