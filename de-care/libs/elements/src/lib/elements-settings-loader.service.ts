import { Injectable, Inject } from '@angular/core';
import { settingsOverride } from '@de-care/settings';
import { ELEMENTS_SETTINGS_KEY, ElementsSettings } from './elements-settings-token';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ElementsSettingsLoaderService {
    constructor(@Inject(DOCUMENT) private readonly _document: Document) {}
    load(
        environment: { production: boolean; elementsSettings: Partial<ElementsSettings> },
        settingsToOverride?: Partial<ElementsSettings>,
        useOverrides = true
    ): ElementsSettings {
        const settings = environment.production && this._document ? this._document.defaultView[ELEMENTS_SETTINGS_KEY] : environment.elementsSettings;
        if (useOverrides && !!settingsToOverride) {
            return settingsOverride<ElementsSettings>(settings, settingsToOverride);
        } else {
            return settings;
        }
    }
}
