import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    getAccountDataBySource,
    setMaskedEmailIdForEmailConfirmation,
    RecoverUserNameFromEmailWorkflowService,
    getIsUsernameSameAsEmail,
    clearUserEnteredEmailAndLastName,
    setIsUsernameSameAsemail,
} from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { Store } from '@ngrx/store';
import { behaviorEventErrorFromSystem, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { take } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-streaming-multiple-account-page-username',
    templateUrl: './multiple-account-page-username.component.html',
    styleUrls: ['./multiple-account-page-username.component.scss'],
})
export class MultipleAccountPageUsernameComponent implements OnInit, ComponentWithLocale, OnDestroy {
    allAccounts$ = this._store.select(getAccountDataBySource);
    accountSelectedToVerify: string;
    isUsernameSameAsEmail = false;
    private _translateSubscription: Subscription;

    constructor(
        private _store: Store,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private _recoverUserNameFromEmailWorkflowService: RecoverUserNameFromEmailWorkflowService,
        readonly translationsForComponentService: TranslationsForComponentService,
        private _titleService: Title
    ) {
        translationsForComponentService.init(this);
        this._translateSubscription = this.translationsForComponentService.stream(`${this.translateKeyPrefix}.FORGOT_USERNAME_PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
        this._store
            .select(getAccountDataBySource)
            .pipe(take(1))
            .subscribe((accounts) => {
                if (accounts?.length === 1) {
                    this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'recoverunsinglematch' }));
                } else {
                    this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'recoverunmultiplematch' }));
                }
            });
        this._store.select(getIsUsernameSameAsEmail).subscribe((isUsernameSameAsEmail) => {
            this.isUsernameSameAsEmail = isUsernameSameAsEmail;
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

    onVerifyClicked(data) {
        this._store.dispatch(setIsUsernameSameAsemail({ isUsernameSameAsemail: data?.isUsernameSameAsEmail }));
        const param = {
            subscriptionId: data?.subscription[0]?.id,
            accountLoginCredentials: data?.accountType === 'oac' ? true : false,
            prospectUser: false,
            accountNumber: data?.last4DigitsOfAccountNumber,
        };
        this._store.dispatch(setMaskedEmailIdForEmailConfirmation({ maskedEmailId: data?.maskedEmail }));
        this._recoverUserNameFromEmailWorkflowService.build(param).subscribe({
            next: (res) => {
                console.log(res);
                this._store.dispatch(clearUserEnteredEmailAndLastName());
                if (this.isUsernameSameAsEmail) {
                    this._navigateTo('../forgot-username-same-mail-confirmation');
                } else {
                    this._navigateTo('../forgot-username-mail-sent-confirmation');
                }
            },
            error: (error) => {
                this._store.dispatch(
                    behaviorEventErrorFromSystem({
                        message: 'We’re sorry… something went wrong. We’re experiencing technical issues and are working on resolving it. Please try again.',
                    })
                );
                console.log(error);
            },
        });
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
