import { AfterViewInit, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import {
    clearDeviceActivationCode,
    getDeviceActivationInProgress,
    getIsSonosFlow,
    getStreamingPlayerLinkTokenInfoViewModel,
} from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'de-care-credential-setup-confirmation-page',
    templateUrl: './credential-setup-confirmation-page.component.html',
    styleUrls: ['./credential-setup-confirmation-page.component.scss'],
})
export class CredentialSetupConfirmationPageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.CredentialSetupConfirmationPageComponent.';
    useContinueCtaText$ = this._store.select(getDeviceActivationInProgress);
    streamingPlayerLinkTokenInfoViewModel$ = this._store.select(getStreamingPlayerLinkTokenInfoViewModel);
    isSonosFlow$ = this._store.select(getIsSonosFlow);

    constructor(private readonly _store: Store, private readonly _router: Router, private readonly _activatedRoute: ActivatedRoute) {}

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'setupaccountcomplete' }));
    }

    onContinue() {
        this._store.dispatch(clearDeviceActivationCode());
        this._router.navigate(['/onboarding/activate-device'], { relativeTo: this._activatedRoute });
    }

    onBackToSignIn() {
        this._router.navigate(['/onboarding/sign-in/sonos'], { relativeTo: this._activatedRoute });
    }
}
