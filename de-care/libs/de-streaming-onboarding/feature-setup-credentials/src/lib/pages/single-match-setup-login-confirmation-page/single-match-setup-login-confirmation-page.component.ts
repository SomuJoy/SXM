import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { backToSignInOverlay } from '@de-care/de-streaming-onboarding/state-setup-credentials';

@Component({
    selector: 'de-streaming-onboarding-single-match-setup-login-confirmation-page',
    templateUrl: './single-match-setup-login-confirmation-page.component.html',
    styleUrls: ['./single-match-setup-login-confirmation-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleMatchSetupLoginConfirmationPageComponent implements OnInit, AfterViewInit {
    translateKeyPrefix = 'DeStreamingOnboardingFeatureSetupCredentialsModule.SingleMatchSetupLoginConfirmationPageComponent.';
    constructor(private readonly _store: Store) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'setupaccountcomplete' }));
    }
    onSignIn() {
        this._store.dispatch(backToSignInOverlay());
    }
}
