import { AfterViewInit, Component } from '@angular/core';
import { backToWelcome } from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { Store, select } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getFeatureFlagIapEnableContactUsTelephone } from '@de-care/shared/state-feature-flags';

@Component({
    selector: 'de-streaming-onboarding-ineligible-no-audio',
    templateUrl: './ineligible-no-audio.component.html',
    styleUrls: ['./ineligible-no-audio.component.scss']
})
export class IneligibleNoAudioComponent implements AfterViewInit {
    translateKeyPrefix = 'DeStreamingOnboardingFeatureSetupCredentialsModule.IneligibleNoAudioComponent.';
    contactUsTelephoneEnabled$ = this._store.pipe(select(getFeatureFlagIapEnableContactUsTelephone));
    constructor(private readonly _store: Store) {}

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'noaudio' }));
    }

    onPreviewClick() {
        this._store.dispatch(backToWelcome());
    }
}
