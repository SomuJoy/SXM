import { backToSignInOverlay, getMaskedPhoneNumber } from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
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
    selector: 'de-streaming-reset-password-text-confirmation-page',
    templateUrl: './reset-password-text-confirmation-page.component.html',
    styleUrls: ['./reset-password-text-confirmation-page.component.scss'],
})
export class ResetPasswordTextConfirmationPageComponent implements OnInit, AfterViewInit, OnDestroy {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    maskedPhone$ = this._store.select(getMaskedPhoneNumber);
    private _translateSubscription: Subscription;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private _store: Store, private _titleService: Title) {
        translationsForComponentService.init(this);
        this._translateSubscription = this.translationsForComponentService.stream(`${this.translateKeyPrefix}.FORGOT_PASSWORD_PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
    }

    ngOnInit(): void {
        console.log('Reset Password text confirmation page');
    }

    onSignIn() {
        this._store.dispatch(backToSignInOverlay());
    }
    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'recoverpwdtextconfirmation' }));
    }

    ngOnDestroy(): void {
        this._translateSubscription.unsubscribe();
    }
}
