import { urlIncludesProtocol } from '@de-care/browser-common';
import { Inject, Injectable } from '@angular/core';
import { AppSettings, Settings } from '@de-care/shared/state-settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    readonly settings: Settings;
    readonly isCanadaMode: boolean;
    readonly multiLanguageSupportEnabled: boolean;
    readonly isCVVEnabled: boolean;

    constructor(@Inject(AppSettings) appSettings) {
        this.settings = {
            ...appSettings,
            // NOTE: if ndClientEnabled comes in as a string we need to support the conversion here,
            //       so we are converting the value to string (boolean false will be 'false' string)
            //       then checking that
            ndClientEnabled: String(appSettings.ndClientEnabled).toLowerCase() === 'true',
            enableCVV: String(appSettings.enableCVV).toLowerCase() === 'true'
        };
        this.isCanadaMode = this.settings.country === 'ca';
        this.isCVVEnabled = this.settings.enableCVV;
        this.multiLanguageSupportEnabled = this.isCanadaMode;
    }
}
