import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    clearUserEnteredEmailOrUsername,
    getSelectedAccount,
    RecoverPasswordFromEmailLookupWorkflowService,
    RecoverPasswordFromPhoneLookupWorkflowService,
    setMaskedEmailIdForEmailConfirmation,
    setMaskedPhoneNumber,
} from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { Store } from '@ngrx/store';
import { VerifyAccountFormComponentApi, VerifyYourAccountFormFieldsComponent } from '@de-care/shared/sxm-ui/ui-verify-your-account-form-fields';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { behaviorEventErrorFromBusinessLogic, behaviorEventErrorFromSystem, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getLanguagePrefix } from '@de-care/domains/customer/state-locale';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-streaming-onboarding-verify-your-account',
    templateUrl: './verify-your-account.component.html',
    styleUrls: ['./verify-your-account.component.scss'],
})
export class VerifyYourAccountComponent implements OnInit, AfterViewInit, ComponentWithLocale, OnDestroy {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    selectedAccount$ = this._store.select(getSelectedAccount);
    @ViewChild(VerifyYourAccountFormFieldsComponent) verifyAccountFormComponentApi: VerifyAccountFormComponentApi;
    langPref: string;
    private _translateSubscription: Subscription;

    constructor(
        private _store: Store,
        private _recoverPasswordFromEmailWorkflowServices: RecoverPasswordFromEmailLookupWorkflowService,
        private _recoverPasswordFromPhoneWorkflowServices: RecoverPasswordFromPhoneLookupWorkflowService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        readonly translationsForComponentService: TranslationsForComponentService,
        private _titleService: Title
    ) {
        translationsForComponentService.init(this);
        this._translateSubscription = this.translationsForComponentService.stream(`${this.translateKeyPrefix}.FORGOT_PASSWORD_PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
        this._store.select(getLanguagePrefix).subscribe((data) => {
            this.langPref = data;
        });
    }

    ngOnInit(): void {
        console.log('Verify page');
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'recoverpwdrecoveryoptions' }));
    }

    onVerifyAccountClick(data) {
        this.verifyAccountFormComponentApi.completedProcessing(true);
        this.verifyAccountFormComponentApi.showBusinessError(false);
        this.verifyAccountFormComponentApi.showSystemError(false);
        if (data?.formValue?.verifyType === 'text') {
            const param = {
                setResetKey: true,
                subscriptionId: data?.accountData?.selectedSubscriptionId ? data?.accountData?.selectedSubscriptionId : data?.accountData?.subscriptions[0]?.id,
                accountLoginCredentials: data?.accountData?.accountType === 'oac' ? true : false,
                phoneNo: data?.formValue?.text,
                langPref: this.langPref,
            };
            this._store.dispatch(setMaskedEmailIdForEmailConfirmation({ maskedEmailId: data?.accountData?.maskedEmail }));
            this._store.dispatch(setMaskedPhoneNumber({ maskedPhoneNumber: data?.accountData?.maskedPhoneNumber }));
            this._recoverPasswordFromPhoneWorkflowServices.build(param).subscribe({
                next: (res) => {
                    this._store.dispatch(clearUserEnteredEmailOrUsername());
                    if (res) {
                        this._navigateTo('../reset-password-text-confirmation');
                    }
                },
                error: (error) => {
                    if (error?.error?.error?.errorCode === 'ERROR_IN_SENDING_TEXT' || error?.error?.error?.errorCode === 'INVALID_USER_ENTERED_PHONE_NUMBER') {
                        this._store.dispatch(
                            behaviorEventErrorFromBusinessLogic({
                                message: 'We’re sorry, something went wrong with this attempt. Please try again.',
                                errorCode: error?.error?.error?.errorCode,
                            })
                        );
                        this.verifyAccountFormComponentApi.completedProcessing(false);
                        this.verifyAccountFormComponentApi.showBusinessError(true);
                    } else {
                        this._store.dispatch(
                            behaviorEventErrorFromSystem({
                                message: 'We’re sorry, something went wrong with this attempt. Please try again.',
                            })
                        );
                        this.verifyAccountFormComponentApi.completedProcessing(false);
                        this.verifyAccountFormComponentApi.showSystemError(true);
                    }
                },
            });
        } else {
            const param = {
                setResetKey: true,
                subscriptionId: data?.accountData?.selectedSubscriptionId ? data?.accountData?.selectedSubscriptionId : data?.accountData?.subscriptions[0]?.id,
                accountLoginCredentials: data?.accountData?.accountType === 'oac' ? true : false,
                prospectUser: false,
                langPref: this.langPref,
            };
            this._store.dispatch(setMaskedEmailIdForEmailConfirmation({ maskedEmailId: data?.accountData?.maskedEmail }));
            this._store.dispatch(setMaskedPhoneNumber({ maskedPhoneNumber: data?.accountData?.maskedPhoneNumber }));
            this._recoverPasswordFromEmailWorkflowServices.build(param).subscribe({
                next: (res) => {
                    this._store.dispatch(clearUserEnteredEmailOrUsername());
                    if (res) {
                        this._navigateTo('../reset-password-mail-confirmation');
                    }
                },
                error: (error) => {
                    if (error?.error?.error?.errorCode === 'ERROR_IN_SENDING_EMAIL') {
                        this.verifyAccountFormComponentApi.completedProcessing(false);
                        this.verifyAccountFormComponentApi.showBusinessError(true);
                    } else {
                        this.verifyAccountFormComponentApi.completedProcessing(false);
                        this.verifyAccountFormComponentApi.showSystemError(true);
                    }
                },
            });
        }
    }

    private _navigateTo(destination: string): void {
        this._router.navigate([destination], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' });
    }

    navigateToNoAccount() {
        this._navigateTo('../account-not-found');
    }

    ngOnDestroy(): void {
        this._translateSubscription.unsubscribe();
    }
}
