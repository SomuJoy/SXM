import { Component, ViewChild } from '@angular/core';
import {
    collectRegistrationCredentials,
    collectRegistrationSecurityQuestionAnswers,
    collectRegistrationServiceAddressAndPhoneNumber,
    getSecurityQuestionsViewModel,
    RegisterAccountWorkflowService,
    selectFlepzData
} from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SxmUiStepperComponent } from '@de-care/shared/sxm-ui/ui-stepper';
import { select, Store } from '@ngrx/store';
import { RegistrationSecurityQuestionsStepComponent, RegistrationSecurityQuestionsStepComponentApi } from '@de-care/domains/account/ui-register-multi-step';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'de-streaming-onboarding-registration-page',
    templateUrl: './registration-page.component.html',
    styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent {
    @ViewChild('stepper') private readonly _stepper: SxmUiStepperComponent;
    existErr = false;
    sysErr = false;
    flepz$ = this._store.select(selectFlepzData);
    @ViewChild(RegistrationSecurityQuestionsStepComponent) registrationSecurityQuestionsStepComponentApi: RegistrationSecurityQuestionsStepComponentApi;
    securityQuestionsViewModel$ = this._store.pipe(select(getSecurityQuestionsViewModel));

    constructor(
        private readonly _store: Store,
        private readonly _registerAccountWorkflowService: RegisterAccountWorkflowService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _router: Router
    ) {}

    submitRegistration(data) {
        this._store.dispatch(
            collectRegistrationSecurityQuestionAnswers({
                securityQuestionAnswers: data
            })
        );
        this._registerAccountWorkflowService.build().subscribe({
            next: result => {
                if (result) {
                    this._router.navigate(['../singlematch-setuploginconfirmation'], { relativeTo: this._activatedRoute }).then(() => {});
                    return;
                }
            },
            error: err => {
                if (err?.errorCode === 'USER_NAME_ALREADY_IN_IDM') {
                    this.existErr = true;
                } else {
                    this.sysErr = true;
                }
                this._stepper.previous();
                this.registrationSecurityQuestionsStepComponentApi?.markAsFinishedProcessing();
            }
        });
    }

    serviceAddressStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'beatthesold' }));
    }

    credentialsStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'beatthesoldsetupaccount' }));
    }

    securityQuestionsStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'beatthesoldcreatesecurityquestions' }));
    }

    getCredentialData(credentialData) {
        if (credentialData) {
            this._store.dispatch(
                collectRegistrationCredentials({
                    credentials: {
                        username: credentialData.username,
                        password: credentialData.password
                    }
                })
            );
            this._stepper.next();
        }
    }

    collectAddressData(addressData) {
        if (addressData) {
            this._store.dispatch(
                collectRegistrationServiceAddressAndPhoneNumber({
                    addressAndPhone: {
                        addressLine1: addressData.addressLine1,
                        city: addressData.city,
                        state: addressData.state,
                        zip: addressData.zip,
                        avsvalidated: addressData.avsvalidated,
                        phoneNumber: addressData.phoneNumber
                    }
                })
            );
            this._stepper.next();
        }
    }
}
