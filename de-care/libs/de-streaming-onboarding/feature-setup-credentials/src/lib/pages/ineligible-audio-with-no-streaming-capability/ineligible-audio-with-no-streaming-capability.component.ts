import { Component, OnInit } from '@angular/core';
import { backToWelcome } from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { Store, select } from '@ngrx/store';
import { getFeatureFlagIapEnableContactUsTelephone } from '@de-care/shared/state-feature-flags';

@Component({
    selector: 'de-streaming-onboarding-ineligible-audio-with-no-streaming-capability',
    templateUrl: './ineligible-audio-with-no-streaming-capability.component.html',
    styleUrls: ['./ineligible-audio-with-no-streaming-capability.component.scss'],
})
export class IneligibleAudioWithNoStreamingCapabilityComponent implements OnInit {
    translateKeyPrefix = 'DeStreamingOnboardingFeatureSetupCredentialsModule.IneligibleNoAudioComponent.';
    contactUsTelephoneEnabled$ = this._store.pipe(select(getFeatureFlagIapEnableContactUsTelephone));
    constructor(private readonly _store: Store) {}

    ngOnInit(): void {}

    onPreviewClick() {
        this._store.dispatch(backToWelcome());
    }
}
