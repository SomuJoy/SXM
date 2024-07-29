import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { CredentialData, SetupSubscriptionCredentialsFormComponentApi } from '@de-care/domains/account/ui-subscription-streaming';
import {
    getFlepzEmail,
    selectSelectedSubscriptionSummaryViewModel,
    UpdateCredentialsWorkflowService,
    getCredentialSetupMaskedUsername,
    getCredentialSetupUsernameShouldBeReadonly,
    getCredentialsFormViewModel,
} from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
    selector: 'de-care-credential-setup-page',
    templateUrl: './credential-setup-page.component.html',
    styleUrls: ['./credential-setup-page.component.scss'],
})
export class CredentialSetupPageComponent implements AfterViewInit, OnDestroy {
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.CredentialSetupPageComponent.';
    translateKeyPrefixShared = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.Shared.';
    subscription$ = this._store.select(selectSelectedSubscriptionSummaryViewModel);
    emailToPrefill$ = this._store.select(getFlepzEmail);
    usernameIsReadonly$ = this._store.select(getCredentialSetupUsernameShouldBeReadonly);
    readonlyEmail$ = this._store.select(getCredentialSetupMaskedUsername);
    credentialsViewModel$ = this._store.select(getCredentialsFormViewModel);
    @ViewChild('credentialWidget') private readonly _credentialWidget: SetupSubscriptionCredentialsFormComponentApi;
    private _translateSubscription: Subscription;

    constructor(
        private readonly _store: Store,
        private readonly _updateCredentialsWorkflowService: UpdateCredentialsWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _translateService: TranslateService,
        private _titleService: Title
    ) {
        this._translateSubscription = this._translateService.stream(`${this.translateKeyPrefixShared}PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'setupcredentials' }));
    }

    ngOnDestroy() {
        this._translateSubscription?.unsubscribe();
    }

    processCredentials(credentialData: CredentialData) {
        this._updateCredentialsWorkflowService.build(credentialData).subscribe(
            () => {
                this._router.navigate(['../setup-login-confirmation'], { relativeTo: this._activatedRoute }).then(() => {
                    this._credentialWidget?.completedProcessing();
                });
            },
            (err) => {
                const errorResponse = err.error.error;
                if (errorResponse?.fieldErrors) {
                    if (errorResponse.fieldErrors[0].errorType === 'SYSTEM') {
                        this._credentialWidget?.showSystemError();
                    } else if (errorResponse.fieldErrors[0].errorCode === 'USER_NAME_ALREADY_IN_IDM') {
                        this._credentialWidget?.showUsernameExistsError();
                    } else if (errorResponse.fieldErrors[0].errorCode === 'INVALID_EMAIL_ADDRESS') {
                        this._router.navigate(['../'], { relativeTo: this._activatedRoute });
                    } else if (errorResponse.fieldErrors[0].errorCode === 'INVALID_FIRST_NAME') {
                        this._router.navigate(['../'], { relativeTo: this._activatedRoute });
                    } else if (errorResponse.fieldErrors[0].errorCode === 'INVALID_PASSWORD') {
                        this._credentialWidget?.showInvalidPasswordError();
                    } else if (errorResponse.fieldErrors[0].errorCode === 'PASSWORD_HAS_PII_DATA') {
                        this._credentialWidget?.showPasswordContainsPiiDataError();
                    } else if (errorResponse.fieldErrors[0].errorType === 'BUSINESS') {
                        this._credentialWidget?.showUsernameExistsError();
                    } else {
                        this._credentialWidget?.showSystemError();
                    }
                } else {
                    this._credentialWidget?.showSystemError();
                }
                this._credentialWidget?.completedProcessing();
            }
        );
    }
}
