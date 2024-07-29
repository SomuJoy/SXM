import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { backToSignInOverlay, getUpdatePasswordAccountType } from '@de-care/de-streaming-onboarding/state-setup-credentials';
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
    selector: 'de-streaming-update-password-confirmation-page',
    templateUrl: './update-password-confirmation-page.component.html',
    styleUrls: ['./update-password-confirmation-page.component.scss'],
})
export class UpdatePasswordConfirmationPageComponent implements OnInit, AfterViewInit, ComponentWithLocale, OnDestroy {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    accountType: any;
    private _translateSubscription: Subscription;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private _store: Store, private _titleService: Title) {
        translationsForComponentService.init(this);
        this._translateSubscription = this.translationsForComponentService.stream(`${this.translateKeyPrefix}.FORGOT_PASSWORD_PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
    }

    ngOnInit(): void {
        this._store.select(getUpdatePasswordAccountType).subscribe((data) => {
            this.accountType = data;
        });
        console.log('Update Password confirmation page');
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'resetpwdconfirmation' }));
    }

    onSignIn() {
        this._store.dispatch(backToSignInOverlay());
    }

    ngOnDestroy(): void {
        this._translateSubscription.unsubscribe();
    }
}
