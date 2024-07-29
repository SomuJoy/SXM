import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
    getSrcQueryParam,
    getTokenValidation,
    IDMUserNameLookupWorkflowService,
    LoadAccountFromCredentialRecoveryLookupWorkflowService,
    processInboundQueryParams,
    setIsRecoverUsernameFlow,
    setTokenValidity,
    setUserEnteredEmailAndLastName,
    clearUserEnteredEmailAndLastName,
} from '@de-care/de-care-use-cases/account/state-account-credentials-management';
import {
    behaviorEventErrorFromBusinessLogic,
    behaviorEventErrorFromSystem,
    behaviorEventImpressionForComponent,
    behaviorEventReactionFeatureTransactionStarted,
} from '@de-care/shared/state-behavior-events';
import { ForgotUsernameFormComponent, LookUpFormComponentApi } from '@de-care/shared/sxm-ui/ui-update-password-form-fields';
import { ComponentLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-forgot-username-landing-page',
    templateUrl: './forgot-username-landing-page.component.html',
    styleUrls: ['./forgot-username-landing-page.component.scss'],
})
export class ForgotUsernameLandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(ForgotUsernameFormComponent) lookUpFormComponentApi: LookUpFormComponentApi;
    accounts: any;
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    isTokenValid$ = this._store.select(getTokenValidation);
    paramVal: any;
    private _translateSubscription: Subscription;
    isThirdPartyError = false;
    
    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private _loadAccountFromCredentialRecoveryLookupWorkflowService: LoadAccountFromCredentialRecoveryLookupWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private _store: Store,
        private _idmUserNameLookupWorkflowService: IDMUserNameLookupWorkflowService,
        private _titleService: Title
    ) {
        translationsForComponentService.init(this);
        this._translateSubscription = this.translationsForComponentService.stream(`${this.translateKeyPrefix}.FORGOT_USERNAME_PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
        this._store.dispatch(setIsRecoverUsernameFlow({ isRecoverUsernameFlow: true }));
        this._store
            .select(getSrcQueryParam)
            .pipe(take(1))
            .subscribe((queryParams) => {
                this.paramVal = queryParams;
                if (queryParams === 'oac' || queryParams === 'sclogin') {
                    this._store.dispatch(processInboundQueryParams());
                }
                if (queryParams) {
                    if (queryParams === 'everestplayer' || queryParams === 'player') {
                        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery', flowVariation: 'streaming' }));
                    } else {
                        this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery', flowVariation: queryParams }));
                    }
                } else {
                    this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'credentialrecovery' }));
                }
            });
    }
    ngOnDestroy(): void {
        this._translateSubscription.unsubscribe();
    }
    ngOnInit(): void {
        console.log('Forgot username landing page');
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'recoverusernamelanding' }));
    }

    onLookupCompleted(value) {
        this.lookUpFormComponentApi.completedProcessing(true);
        this.isThirdPartyError = false;
        const param = {
            emailOrUsername: value?.emailOrUserName?.email,
            lastName: value?.emailOrUserName?.lastname,
            source: this.paramVal,
        };
        this._store.dispatch(setUserEnteredEmailAndLastName({ userEnteredEmail: value?.emailOrUserName?.email, userEnteredLastname: value?.emailOrUserName?.lastname }));
        this._loadAccountFromCredentialRecoveryLookupWorkflowService.build(param).subscribe(
            (account) => {
                this._store.dispatch(setTokenValidity({ isTokenInvalid: false }));
                if (account.length > 0) {
                    let subscriptionLength = 0;
                    account.forEach((element) => {
                        if (element && element.subscriptions) {
                            subscriptionLength += element.subscriptions.length;
                        }
                    });
                    if (subscriptionLength !== 0) {
                        this._navigateTo('../multiple-page-username');
                    } else if (param.source === 'oac' || !param.source || param.source === 'organic' || param.source === 'sclogin') {
                        this._navigateTo('../multiple-page-username');
                    } else {
                        this._navigateTo('../account-not-found');
                    }
                } else {
                    this._navigateTo('../account-not-found');
                }
            },
            (error) => {
                this.lookUpFormComponentApi.completedProcessing(false);
                if (error?.error?.error?.errorType === 'BUSINESS') {
                    if (error?.error?.error?.errorCode === 'ACCOUNT_OR_USERNAME_NOT_FOUND') {
                        this._store.dispatch(
                            behaviorEventErrorFromBusinessLogic({ message: 'Takes user to radio id/acct number page', errorCode: error?.error?.error?.errorCode })
                        );
                        return this._idmUserNameLookupWorkflowService.build(param).subscribe(
                            (res) => {
                                this._store.dispatch(clearUserEnteredEmailAndLastName());

                                if (res?.isEmailSameAsUsername) {
                                    this._navigateTo('../forgot-username-same-mail-confirmation');
                                } else {
                                    this._navigateTo('../forgot-username-mail-sent-confirmation');
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
                    } else if (error?.error?.error?.errorCode === 'CUSTOMER_TYPE_NOT_SUPPORTED') {
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
    private _navigateTo(destination: string): void {
        this._router.navigate([destination], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' });
    }
}
