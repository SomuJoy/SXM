import { Inject, Injectable } from '@angular/core';
import { CanMatch } from '@angular/router';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

@Injectable({ providedIn: 'root' })
export class AllowIfNotCanadaModeCanMatchService implements CanMatch {
    constructor(@Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken) {}

    canMatch(): boolean {
        return this._countrySettings.countryCode.toLowerCase() !== 'ca';
    }
}
