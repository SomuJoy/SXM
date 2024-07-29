import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { getCurrentUserViewModel } from '@de-care/de-care-use-cases/checkout/state-streaming';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveComponentModule } from '@ngrx/component';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'bummer-error',
    standalone: true,
    imports: [CommonModule, TranslateModule, ReactiveComponentModule],
    styleUrls: ['./you-already-have-a-subscription-error-page.component.scss'],
    templateUrl: './you-already-have-a-subscription-error-page.component.html',
})
export class YouAlreadyHaveASubscriptionErrorPageComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    currentUserViewModel$ = this._store.select(getCurrentUserViewModel);
    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _store: Store) {
        translationsForComponentService.init(this);
    }
}
