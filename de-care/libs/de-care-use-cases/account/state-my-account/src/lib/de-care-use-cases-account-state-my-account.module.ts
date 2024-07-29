import { NgModule, Inject } from '@angular/core';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsAccountStateNextBestActionsModule } from '@de-care/domains/account/state-next-best-actions';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';
import { SharedStateFeatureFlagsModule } from '@de-care/shared/state-feature-flags';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { Effects } from './state/effects';
import { featureKey, reducer } from './state/reducer';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { setCurrentLocale, setSkipCancelOverlay } from './state/actions';
import { locales } from './state/helpers';
import { TranslateService } from '@ngx-translate/core';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([Effects]),
        DomainsOffersStatePackageDescriptionsModule,
        DomainsAccountStateAccountModule,
        DomainsQuotesStateQuoteModule,
        SharedStateFeatureFlagsModule,
        DomainsAccountStateNextBestActionsModule,
    ],
})
export class DeCareUseCasesAccountStateMyAccountModule {
    constructor(private readonly _store: Store, @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken, translateService: TranslateService) {
        this._store.dispatch(setSkipCancelOverlay({ skipCancelOverlay: this._countrySettings?.countryCode?.toLowerCase() === 'us' }));

        _store.dispatch(setCurrentLocale({ locale: translateService.currentLang as locales }));
        translateService.onLangChange.subscribe({
            next: ({ lang: locale }) => _store.dispatch(setCurrentLocale({ locale })),
        });
    }
}
