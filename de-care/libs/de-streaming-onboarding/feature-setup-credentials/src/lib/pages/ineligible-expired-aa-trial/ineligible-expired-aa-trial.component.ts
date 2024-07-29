import { AfterViewInit, Component, OnInit } from '@angular/core';
import { backToWelcome } from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store, select } from '@ngrx/store';
import { getFeatureFlagIapEnableContactUsTelephone } from '@de-care/shared/state-feature-flags';

@Component({
    selector: 'de-streaming-onboarding-ineligible-expired-aa-trial',
    templateUrl: './ineligible-expired-aa-trial.component.html',
    styleUrls: ['./ineligible-expired-aa-trial.component.scss']
})
export class IneligibleExpiredAATrialComponent implements OnInit, AfterViewInit {
    translateKeyPrefix = 'DeStreamingOnboardingFeatureSetupCredentialsModule.IneligibleExpiredAATrialComponent.';
    contactUsTelephoneEnabled$ = this._store.pipe(select(getFeatureFlagIapEnableContactUsTelephone));
    constructor(private readonly _store: Store) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'trialexpired' }));
    }

    onPreviewClick() {
        this._store.dispatch(backToWelcome());
    }
}
