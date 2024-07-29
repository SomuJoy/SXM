import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
    getAccountDataBySource,
    setSelectedAccount,
    VerifyAccountWorkflowService,
    VerifyAccountWorkflowServiceResult,
} from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';

import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
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
    selector: 'de-streaming-onboarding-multiple-account-page',
    templateUrl: './forgot-password-multiple-account-page.component.html',
    styleUrls: ['./forgot-password-multiple-account-page.component.scss'],
})
export class ForgotPasswordMultipleAccountPageComponent implements OnInit, ComponentWithLocale, OnDestroy {
    allAccounts$ = this._store.select(getAccountDataBySource);
    accountSelectedToVerify: string;
    private _translateSubscription: Subscription;

    constructor(
        private _store: Store,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private _verifyAccountWorkflowService: VerifyAccountWorkflowService,
        readonly translationsForComponentService: TranslationsForComponentService,
        private _titleService: Title
    ) {
        translationsForComponentService.init(this);
        this._translateSubscription = this.translationsForComponentService.stream(`${this.translateKeyPrefix}.FORGOT_PASSWORD_PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
        this._store
            .select(getAccountDataBySource)
            .pipe(take(1))
            .subscribe((accounts) => {
                if (accounts?.length === 1) {
                    this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'recoverpwdsinglematch' }));
                } else {
                    this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'recoverpwdmultiplematch' }));
                }
            });
    }
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    providers?: any[];
    ngOnInit(): void {
        console.log('Multiple username page');
    }

    ngOnDestroy(): void {
        this._translateSubscription.unsubscribe();
    }

    onVerifyClicked(account) {
        if (account) {
            const payLoad = {
                accountNumber: account.last4DigitsOfAccountNumber,
            };
            this._verifyAccountWorkflowService.build(payLoad).subscribe({
                next: (response: VerifyAccountWorkflowServiceResult) => {
                    if (response === 'USE_BOTH') {
                        account.canUseEmail = true;
                        account.canUsePhone = true;
                    } else if (response === 'USE_EMAIL') {
                        account.canUseEmail = true;
                    } else if (response === 'USE_PHONE') {
                        account.canUsePhone = true;
                    }
                    this._store.dispatch(setSelectedAccount({ selectedAccount: account }));
                    this._navigateTo(response === 'USE_BOTH' || 'USE_EMAIL' || 'USE_PHONE' ? '../verify-your-account' : '/account/registration');
                },
            });
        } else {
            this._navigateTo('/account/registration');
        }
    }

    private _navigateTo(destination: string): void {
        this._router.navigate([destination], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' });
    }

    onNoAccount() {
        this._navigateTo('../account-not-found');
    }

    onCTAClicked(cta: String) {
        if (cta === 'login') {
            this._navigateTo('../find-account');
        }
    }
}
