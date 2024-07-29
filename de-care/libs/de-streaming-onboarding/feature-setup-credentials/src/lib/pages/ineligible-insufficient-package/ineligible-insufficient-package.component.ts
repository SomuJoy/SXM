import { AfterViewInit, Component, OnInit } from '@angular/core';
import { backToWelcome } from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';
import { getFeatureFlagIapEnableContactUsTelephone } from '@de-care/shared/state-feature-flags';

@Component({
    selector: 'de-streaming-onboarding-ineligible-insufficient-package',
    templateUrl: './ineligible-insufficient-package.component.html',
    styleUrls: ['./ineligible-insufficient-package.component.scss'],
})
export class IneligibleInsufficientPackageComponent implements OnInit, AfterViewInit {
    translateKeyPrefix = 'DeStreamingOnboardingFeatureSetupCredentialsModule.IneligibleInsufficientPackageComponent.';
    contactUsTelephoneEnabled$ = this._store.pipe(select(getFeatureFlagIapEnableContactUsTelephone));
    constructor(private readonly _store: Store) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'noteligiblefortrial' }));
    }

    onPreviewClick() {
        this._store.dispatch(backToWelcome());
    }
}
