import { InjectionToken } from '@angular/core';

export interface AppSettings {
    countryCode: 'us' | 'ca';
    defaultLocale: 'en-US' | 'en-CA' | 'fr-CA';
    oacUrl: string;
    careUrl: string;
    apiUrl: string;
    ndClientId: string;
    ndClientEnabled: boolean;
    dotComUrl: string;
    smartLinkUrls: {
        toPlayerApp: string;
        toPlayerAppForInstantStream: string;
    };
}
export const APP_SETTINGS = new InjectionToken<AppSettings>('appSettings');
