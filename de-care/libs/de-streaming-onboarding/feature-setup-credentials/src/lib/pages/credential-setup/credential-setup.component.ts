import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { getFlepzEmail, selectSelectedSubscriptionSummaryViewModel, UpdateCredentialsWorkflowService } from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { SetupSubscriptionCredentialsFormComponent, SetupSubscriptionCredentialsFormComponentApi } from '@de-care/domains/account/ui-subscription-streaming';

@Component({
    selector: 'de-streaming-onboarding-credential-setup',
    templateUrl: './credential-setup.component.html',
    styleUrls: ['./credential-setup.component.scss'],
})
export class CredentialSetupComponent implements OnInit, AfterViewInit {
    subscription$ = this._store.pipe(select(selectSelectedSubscriptionSummaryViewModel));
    flepzEmail = '';
    @ViewChild(SetupSubscriptionCredentialsFormComponent) setupSubscriptionCredentialsFormComponentApi: SetupSubscriptionCredentialsFormComponentApi;
    credentialsViewModel = { email: false, username: true };

    constructor(
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _updateCredentialsWorkflowService: UpdateCredentialsWorkflowService,
        private _activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._store
            .select(getFlepzEmail)
            .pipe(take(1))
            .subscribe((flepzEmail) => {
                this.flepzEmail = flepzEmail.toLowerCase();
            });
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'setupcredentials' }));
    }

    onSubmitClick(payload) {
        this._updateCredentialsWorkflowService.build(payload).subscribe(
            () => {
                this._router.navigate(['../singlematch-setuploginconfirmation'], { relativeTo: this._activatedRoute }).then(() => {
                    this.setupSubscriptionCredentialsFormComponentApi?.completedProcessing();
                });
            },
            (err) => {
                const errorResponse = err.error.error;
                if (errorResponse?.fieldErrors) {
                    if (errorResponse.fieldErrors[0].errorType === 'SYSTEM') {
                        this.setupSubscriptionCredentialsFormComponentApi?.showSystemError();
                    } else if (errorResponse.fieldErrors[0].errorCode === 'USER_NAME_ALREADY_IN_IDM') {
                        this.setupSubscriptionCredentialsFormComponentApi?.showUsernameExistsError();
                    } else if (errorResponse.fieldErrors[0].errorCode === 'INVALID_EMAIL_ADDRESS') {
                        this._router.navigate(['../find-account'], { relativeTo: this._activatedRoute });
                    } else if (errorResponse.fieldErrors[0].errorCode === 'INVALID_FIRST_NAME') {
                        this._router.navigate(['../find-account'], { relativeTo: this._activatedRoute });
                    } else if (errorResponse.fieldErrors[0].errorCode === 'INVALID_PASSWORD') {
                        this.setupSubscriptionCredentialsFormComponentApi?.showInvalidPasswordError();
                    } else if (errorResponse.fieldErrors[0].errorCode === 'PASSWORD_HAS_PII_DATA') {
                        this.setupSubscriptionCredentialsFormComponentApi?.showPasswordContainsPiiDataError();
                    } else if (errorResponse.fieldErrors[0].errorType === 'BUSINESS') {
                        this.setupSubscriptionCredentialsFormComponentApi?.showUsernameExistsError();
                    } else {
                        this.setupSubscriptionCredentialsFormComponentApi?.showSystemError();
                    }
                } else {
                    this.setupSubscriptionCredentialsFormComponentApi?.showSystemError();
                }
                this.setupSubscriptionCredentialsFormComponentApi?.completedProcessing();
            }
        );
    }
}
