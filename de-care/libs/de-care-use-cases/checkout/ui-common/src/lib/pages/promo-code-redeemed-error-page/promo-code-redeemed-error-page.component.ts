import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'promo-code-redeemed-error-page',
    styleUrls: ['./promo-code-redeemed-error-page.component.scss'],
    templateUrl: './promo-code-redeemed-error-page.component.html',
})
export class PromoCodeRedeemedErrorPageComponent implements ComponentWithLocale, AfterViewInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    constructor(readonly translationsForComponentService: TranslationsForComponentService, private _store: Store, public readonly activatedRoute: ActivatedRoute) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'PromoCodeRedeemedErrorPage' }));
    }
}
