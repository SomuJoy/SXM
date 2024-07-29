import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
    getIsThirdPartyLinkingVendorIdSonos,
    getMaskedPhoneNumber,
    getOrganicSelectedAccountType,
    getQueryParamsWithoutSource,
    getSrcQueryParam,
} from '@de-care/de-care-use-cases/account/state-account-credentials-management';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-reset-password-text-confirmation-page',
    templateUrl: './reset-password-text-confirmation-page.component.html',
    styleUrls: ['./reset-password-text-confirmation-page.component.scss'],
})
export class ResetPasswordTextConfirmationPageComponent implements OnInit, AfterViewInit, OnDestroy {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    maskedPhone$ = this._store.select(getMaskedPhoneNumber);
    paramValue$ = this._store.select(getQueryParamsWithoutSource);
    srcValue$ = this._store.select(getSrcQueryParam);
    private _translateSubscription: Subscription;
    isSonosFlow$ = this._store.select(getIsThirdPartyLinkingVendorIdSonos);
    isOrganic = false;
    ishowOrganic = false;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private _store: Store, private _titleService: Title, private _router: Router) {
        translationsForComponentService.init(this);
        this._translateSubscription = this.translationsForComponentService.stream(`${this.translateKeyPrefix}.FORGOT_PASSWORD_PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
    }

    ngOnInit(): void {
        this._store.select(getSrcQueryParam).subscribe((src) => {
            if (src === 'organic') {
                this.isOrganic = true;
            }
        });
        this._store.select(getOrganicSelectedAccountType).subscribe((accountType) => {
            if (this.isOrganic && accountType === 'oac') {
                this.ishowOrganic = true;
            }
        });
        console.log('Reset Password text confirmation page');
    }

    ngOnDestroy(): void {
        this._translateSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'recoverpwdtextconfirmation' }));
    }

    navigateToSonos() {
        this._router.navigate(['onboarding/sign-in/sonos']);
    }

    navigateToAccountLogin() {
        this._router.navigate(['account/login']);
    }
}
