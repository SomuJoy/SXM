import { Inject, NgModule } from '@angular/core';
import { DeCareUseCasesCheckoutStateCommonModule } from '@de-care/de-care-use-cases/checkout/state-common';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsAccountStateSecurityQuestionsModule } from '@de-care/domains/account/state-security-questions';
import { DomainsAccountStateSessionDataModule } from '@de-care/domains/account/state-session-data';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';
import { DomainsUtilityStateIpLocationModule } from '@de-care/domains/utility/state-ip-location';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { loadCountryCode, usefullAddressForm } from './state/actions';
import { Effects } from './state/effects';
import { featureKey, reducer } from './state/reducer';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([Effects]),
        DeCareUseCasesCheckoutStateCommonModule,
        DomainsOffersStateOffersWithCmsModule,
        DomainsOffersStatePackageDescriptionsModule,
        DomainsAccountStateSessionDataModule,
        DomainsAccountStateAccountModule,
        DomainsQuotesStateQuoteModule,
        DomainsAccountStateSecurityQuestionsModule,
        DomainsUtilityStateIpLocationModule,
    ],
    providers: [Effects],
})
export class DeCareUseCasesCheckoutStateStreamingRollToDropModule {
    constructor(readonly store: Store, @Inject(COUNTRY_SETTINGS) readonly countrySettings: CountrySettingsToken) {
        countrySettings?.countryCode?.toLowerCase() !== 'us' && store.dispatch(usefullAddressForm());
        store.dispatch(loadCountryCode({ countryCode: countrySettings?.countryCode }));
    }
}
