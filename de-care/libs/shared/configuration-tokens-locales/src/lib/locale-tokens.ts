import { InjectionToken } from '@angular/core';

export type Locales = 'en-CA' | 'en-US' | 'fr-CA';

export interface TranslationSettingsToken {
    canToggleLanguage: boolean;
    languagesSupported: Locales[];
    defaultLanguage?: 'en-US' | 'en-CA' | 'fr-CA';
}

export const TRANSLATION_SETTINGS = new InjectionToken<TranslationSettingsToken>('translationSettings', {
    providedIn: 'root',
    factory: () => ({ canToggleLanguage: false, languagesSupported: ['en-US'], defaultLanguage: 'en-US' }),
});

export interface CountrySettingsToken {
    countryCode: 'us' | 'ca';
}

export const COUNTRY_SETTINGS = new InjectionToken<CountrySettingsToken>('countrySettings', {
    providedIn: 'root',
    factory: () => ({ countryCode: 'us' }),
});
