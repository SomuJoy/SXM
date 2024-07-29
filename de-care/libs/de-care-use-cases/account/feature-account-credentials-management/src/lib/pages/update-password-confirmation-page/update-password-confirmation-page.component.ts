import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { getQueryParams, getSrcQueryParam, getUpdatePasswordAccountType } from '@de-care/de-care-use-cases/account/state-account-credentials-management';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
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
    selector: 'de-care-update-password-confirmation-page',
    templateUrl: './update-password-confirmation-page.component.html',
    styleUrls: ['./update-password-confirmation-page.component.scss'],
})
export class UpdatePasswordConfirmationPageComponent implements OnInit, ComponentWithLocale, AfterViewInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    paramValue$ = this._store.select(getQueryParams);
    srcValue$ = this._store.select(getSrcQueryParam);
    accountType: any;
    private _translateSubscription: Subscription;
    isOrganic = false;
    ishowOrganic = false;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private _store: Store, private _titleService: Title, private _router: Router) {
        translationsForComponentService.init(this);
        this._translateSubscription = this.translationsForComponentService.stream(`${this.translateKeyPrefix}.FORGOT_PASSWORD_PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'resetpwdconfirmation' }));
    }

    ngOnInit(): void {
        this._store.select(getUpdatePasswordAccountType).subscribe((data) => {
            this.accountType = data;
        });
        this._store.select(getSrcQueryParam).subscribe((src) => {
            if (src === 'organic') {
                this.isOrganic = true;
            }
            if (this.isOrganic && this.accountType === 'oac') {
                this.ishowOrganic = true;
            }
        });
        console.log('Update Password confirmation page');
    }

    ngOnDestroy(): void {
        this._translateSubscription.unsubscribe();
    }

    navigateToAccountLogin() {
        this._router.navigate(['account/login']);
    }
}
