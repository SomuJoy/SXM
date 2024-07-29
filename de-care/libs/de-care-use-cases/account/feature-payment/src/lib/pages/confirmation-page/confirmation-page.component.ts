import { Component, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { getConfirmationPageViewModel } from '@de-care/de-care-use-cases/account/state-payment';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { PrintService } from '@de-care/shared/browser-common/window-print';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Router } from '@angular/router';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-confirmation-page',
    templateUrl: './confirmation-page.component.html',
    styleUrls: ['./confirmation-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationPageComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    infoForConfirmationPage$ = this._store.select(getConfirmationPageViewModel);
    currentLang$ = this.translationsForComponentService.currentLang$;
    constructor(
        private readonly _store: Store,
        private _printService: PrintService,
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _router: Router
    ) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'confirmation-pay' }));
    }

    printConfirmationPage() {
        this._printService.print();
    }

    goToMyAccount() {
        const langPref = this.translationsForComponentService.currentLang === 'fr-CA' ? 'fr' : 'en';
        this._router.navigate(['account', 'manage', 'dashboard'], { queryParams: { langPref } });
    }
}
