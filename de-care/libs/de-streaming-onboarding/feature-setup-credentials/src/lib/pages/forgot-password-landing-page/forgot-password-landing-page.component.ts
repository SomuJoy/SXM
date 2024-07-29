import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    IDMUserLookupWorkflowService,
    LoadAccountFromCredentialRecoveryLookupWorkflowService,
    getTokenValidation,
    setTokenValidity,
    getSrcQueryParam,
    processInboundQueryParams,
    setUserEnteredEmailOrUsername,
    clearUserEnteredEmailOrUsername,
    backToSignInOverlay,
} from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { UpdatePasswordFormFieldsComponent, LookUpFormComponentApi } from '@de-care/shared/sxm-ui/ui-update-password-form-fields';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import {
    behaviorEventErrorFromBusinessLogic,
    behaviorEventErrorFromSystem,
    behaviorEventImpressionForComponent,
    behaviorEventReactionFeatureTransactionStarted,
} from '@de-care/shared/state-behavior-events';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { getLanguagePrefix } from '@de-care/domains/customer/state-locale';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-streaming-onboarding-forgot-password-landing-page',
    templateUrl: './forgot-password-landing-page.component.html',
    styleUrls: ['./forgot-password-landing-page.component.scss'],
})
export class ForgotPasswordLandingPageComponent implements OnInit, AfterViewInit, ComponentWithLocale, OnDestroy {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    @ViewChild(UpdatePasswordFormFieldsComponent) lookUpFormComponentApi: LookUpFormComponentApi;
    accounts: any;
    isTokenValid$ = this._store.select(getTokenValidation);
    paramVal: any;
    private _translateSubscription: Subscription;
    langPref: string;
    isThirdPartyError = false;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private _loadAccountFromCredentialRecoveryLookupWorkflowService: LoadAccountFromCredentialRecoveryLookupWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private _store: Store,
        private _idmUserLookupWorkflowService: IDMUserLookupWorkflowService,
        private _titleService: Title
    ) {
        translationsForComponentService.init(this);
        this._translateSubscription = this.translationsForComponentService.stream(`${this.translateKeyPrefix}.FORGOT_PASSWORD_PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
        this._store.select(getLanguagePrefix).subscribe((data) => {
            this.langPref = data;
        });
        this._store
            .select(getSrcQueryParam)
            .pipe(take(1))
            .subscribe((queryParams) => {
                this.paramVal = queryParams;
                if (queryParams === 'oac' || queryParams === 'sclogin') {
                    this._store.dispatch(processInboundQueryParams());
                }
                if (queryParams === 'player' || 'everestplayer') {
                    this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery', flowVariation: 'iap' }));
                }
                if (queryParams === 'alexa') {
                    this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery', flowVariation: 'iapalexa' }));
                }
                if (queryParams === 'google') {
                    this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery', flowVariation: 'iapgoogle' }));
                } else {
                    this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery', flowVariation: queryParams }));
                }
            });
    }
    ngOnDestroy(): void {
        this._translateSubscription.unsubscribe();
    }

    ngOnInit(): void {
        console.log('Forgot Password landing page');
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'recoverpasswordlanding' }));
    }

    onLookupCompleted(value) {
        this.lookUpFormComponentApi.completedProcessing(true);
        this.isThirdPartyError = false;
        const param = {
            emailOrUsername: value?.emailOrUserName?.username,
            source: 'streaming',
        };
        this._store.dispatch(setUserEnteredEmailOrUsername({ userEnteredEmailOrUsername: value?.emailOrUserName?.username }));
        this._loadAccountFromCredentialRecoveryLookupWorkflowService.build(param).subscribe(
            (account) => {
                if (account.length > 0) {
                    this._store.dispatch(setTokenValidity({ isTokenInvalid: false }));
                    let subscriptionLength = 0;
                    account.forEach((element) => {
                        if (element && element.subscriptions) {
                            subscriptionLength += element.subscriptions.length;
                        }
                    });
                    if (subscriptionLength !== 0) {
                        this._navigateTo('../multiple-page');
                    } else if (param.source === 'oac' || !param.source || param.source === 'sclogin') {
                        this._navigateTo('../multiple-page');
                    } else {
                        this._navigateTo('../account-not-found');
                    }
                } else {
                    this._navigateTo('../account-not-found');
                }
            },
            (error) => {
                this._store.dispatch(setTokenValidity({ isTokenInvalid: false }));
                this.lookUpFormComponentApi.completedProcessing(false);
                if (error?.error?.error?.errorType === 'BUSINESS') {
                    if (error?.error?.error?.errorCode === 'ACCOUNT_OR_USERNAME_NOT_FOUND') {
                        this._store.dispatch(
                            behaviorEventErrorFromBusinessLogic({ message: 'Takes user to radio id/acct number page', errorCode: error?.error?.error?.errorCode })
                        );
                        const param = {
                            emailOrUsername: value?.emailOrUserName?.username,
                            langPref: this.langPref,
                        };
                        return this._idmUserLookupWorkflowService.build(param).subscribe(
                            (res) => {
                                this._store.dispatch(clearUserEnteredEmailOrUsername());
                                if (res) {
                                    this._navigateTo('../reset-password-mail-confirmation');
                                }
                            },
                            (error) => {
                                this._store.dispatch(
                                    behaviorEventErrorFromBusinessLogic({
                                        message: 'Takes user to radio id/acct number page',
                                        errorCode: 'USER_NOT_FOUND_IN_IDM',
                                    })
                                );
                                this.lookUpFormComponentApi.completedProcessing(false);
                                this._navigateTo('../account-not-found');
                            }
                        );
                    } else if(this.paramVal === 'oac' && error?.error?.error?.errorCode === 'CUSTOMER_TYPE_NOT_SUPPORTED') {
                        this.isThirdPartyError = true;
                    }
                } else {
                    this._store.dispatch(
                        behaviorEventErrorFromSystem({
                            message: 'We’re sorry… something went wrong. We’re experiencing technical issues and are working on resolving it. Please try again.',
                        })
                    );
                    this._navigateTo('../account-not-found');
                }
            }
        );
    }

    goToRecoverUsername() {
        this._navigateTo('../forgot-username');
    }

    private _navigateTo(destination: string): void {
        this._router.navigate([destination], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' }).then(() => {});
    }

    onSignInClick() {
        this._store.dispatch(backToSignInOverlay());
    }
}
