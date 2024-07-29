import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { settingsOverride } from '@de-care/shared/state-settings';
import { STREAMING_ONBOARDING_SETTINGS_KEY } from './constants';
import { StreamingOnboardingSettings } from './state/settings.interface';

@Injectable({ providedIn: 'root' })
export class StreamingOnboardingSettingsLoaderService {
    constructor(@Inject(DOCUMENT) private readonly _document: Document) {}

    load(
        environment: { production: boolean; streamingOnboardingSettings: Partial<StreamingOnboardingSettings> },
        settingsToOverride?: Partial<StreamingOnboardingSettings>,
        useOverrides = true
    ): StreamingOnboardingSettings {
        const settings = environment.production && this._document ? this._document.defaultView[STREAMING_ONBOARDING_SETTINGS_KEY] : environment.streamingOnboardingSettings;
        if (useOverrides && !!settingsToOverride) {
            return settingsOverride<StreamingOnboardingSettings>(settings, settingsToOverride);
        } else {
            return settings;
        }
    }
}
