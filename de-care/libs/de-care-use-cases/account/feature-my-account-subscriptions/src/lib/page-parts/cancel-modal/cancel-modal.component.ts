import { Component, AfterViewInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getSelectedSubscriptionId } from '@de-care/de-care-use-cases/account/state-my-account';
import { getCancelSubscriptionOptions } from '@de-care/de-care-use-cases/account/state-my-account-subscriptions';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { concatMap, map } from 'rxjs/operators';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'my-account-cancel-modal',
    templateUrl: './cancel-modal.component.html',
    styleUrls: ['./cancel-modal.component.scss'],
})
export class CancelModalComponent implements ComponentWithLocale, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    selectedSubscriptionId$ = this._store.select(getSelectedSubscriptionId);
    currentLanguage$ = this.translationsForComponentService.currentLang$;
    cancelOptions$ = this.selectedSubscriptionId$.pipe(
        concatMap((subscriptionId) =>
            this._store.select(getCancelSubscriptionOptions(subscriptionId)).pipe(
                map((types) => ({
                    types,
                    subscriptionId,
                }))
            )
        ),
        map((options) => {
            if (this._countrySettings.countryCode.toLowerCase() === 'ca') {
                const transferOption = options?.types?.includes('TRANSFER');
                const typesUpdated = [];
                if (this.translationsForComponentService.currentLang === 'en-CA') {
                    typesUpdated.push('CHAT_CANCEL');
                } else {
                    typesUpdated.push('CANCEL');
                }
                transferOption && typesUpdated?.push('TRANSFER');
                typesUpdated.push('CALL');
                return { ...options, types: typesUpdated };
            } else {
                return options;
            }
        })
    );

    allowOnlyCancelOnline = this.translationsForComponentService.currentLang === 'fr-CA';

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _store: Store,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit(): void {
        // TODO: router-outlet modal pattern allows tracking directly child my-account-cancel-links-hybrid-bau. But My account flow is using
        // the old modal pattern. When modal pattern is udpated in the flow, tracking should be done in the inner components.
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:Cancel' }));
    }

    onClosed() {
        this._router.navigate([{ outlets: { modal: null } }], { relativeTo: this._activatedRoute.parent });
    }
}
