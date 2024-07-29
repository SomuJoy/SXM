import { AfterViewInit, Component, OnInit } from '@angular/core';
import { backToWelcome } from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';

@Component({
    selector: 'de-streaming-onboarding-ineligible-non-pay-page',
    templateUrl: './ineligible-non-pay-page.component.html',
    styleUrls: ['./ineligible-non-pay-page.component.scss']
})
export class IneligibleNonPayPageComponent implements OnInit, AfterViewInit {
    translateKeyPrefix = 'DeStreamingOnboardingFeatureSetupCredentialsModule.IneligibleNonPayPageComponent.';
    constructor(private readonly _store: Store) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'subscriptionpastdue' }));
    }

    onPreviewClick() {
        this._store.dispatch(backToWelcome());
    }
}
