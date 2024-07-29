import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { backToSignInOverlay, getEmailSentMaskedEmailId } from '@de-care/de-streaming-onboarding/state-setup-credentials';
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
    selector: 'de-streaming-forgot-username-email-sent-confirmation-page',
    templateUrl: './forgot-username-email-sent-confirmation-page.component.html',
    styleUrls: ['./forgot-username-email-sent-confirmation-page.component.scss'],
})
export class ForgotUsernameEmailSentConfirmationPageComponent implements OnInit, ComponentWithLocale, AfterViewInit, OnDestroy {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    maskedEmail$ = this._store.select(getEmailSentMaskedEmailId);
    private _translateSubscription: Subscription;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private _store: Store, private _titleService: Title) {
        translationsForComponentService.init(this);
        this._translateSubscription = this.translationsForComponentService.stream(`${this.translateKeyPrefix}.FORGOT_USERNAME_PAGE_TITLE`).subscribe((pageTitle) => {
            this._titleService.setTitle(pageTitle);
        });
    }

    ngOnInit(): void {
        console.log('Forgot username email sent confirmation page');
    }

    ngOnDestroy(): void {
        this._translateSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'recoverunemailconfirmation' }));
    }

    onSignIn() {
        this._store.dispatch(backToSignInOverlay());
    }
}
