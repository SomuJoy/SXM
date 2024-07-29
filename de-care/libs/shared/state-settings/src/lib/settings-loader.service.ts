import { Injectable, Inject } from '@angular/core';
import { settingsOverride } from './settings-override.function';
import { DOCUMENT } from '@angular/common';
import { APP_SETTINGS_KEY } from './state/settings.constants';
import { Settings } from './state/settings.interface';

@Injectable({ providedIn: 'root' })
export class SettingsLoaderService {
    constructor(@Inject(DOCUMENT) private readonly _document: Document) {}

    load(environment: { production: boolean; settings: Partial<Settings> }, settingsToOverride?: Partial<Settings>, useOverrides = true): Settings {
        const settings = environment.production && this._document ? this._document.defaultView[APP_SETTINGS_KEY] : environment.settings;
        if (useOverrides && !!settingsToOverride) {
            return settingsOverride<Settings>(settings, settingsToOverride);
        } else {
            return settings;
        }
    }
}
