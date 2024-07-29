import { Injectable } from '@angular/core';
import { LANGUAGE_CODES, SettingsService } from '@de-care/settings';

@Injectable({
    providedIn: 'root'
})
export class NormalizeLangPrefHelperService {
    constructor(private _settingsService: SettingsService) {}

    // TODO: unit test
    public normalize(langPrefParam: string, failoverCountry?: string): string {
        const asArray = langPrefParam.split('-');
        const lang = asArray[0].toLowerCase();
        const country = asArray[1] ? asArray[1] : failoverCountry ? failoverCountry : '';
        return `${lang.toLowerCase()}-${country.toUpperCase()}`;
    }

    // expects langPref as lang+country ex: 'fr-ca'
    public getLangKey(langPref: string) {
        return langPref.split('-')[0];
    }

    public langPrefValid(param: string) {
        if (!param) {
            return false;
        }
        const country = this._settingsService.settings.country.toUpperCase();
        const langPrefParam = !!param ? this.normalize(param, country) : null;
        const languageCodeKey = !!langPrefParam && langPrefParam.replace('-', '_');
        const locale = !!langPrefParam && LANGUAGE_CODES[languageCodeKey.toUpperCase()];
        return !!locale;
    }
}
