import { Inject, NgModule } from '@angular/core';
import { featureKey, reducer } from './state/reducer';
import { Store, StoreModule } from '@ngrx/store';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsCmsStateCampaignsModule } from '@de-care/domains/cms/state-campaigns';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';
import { DomainsAccountStateSecurityQuestionsModule } from '@de-care/domains/account/state-security-questions';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';
import { DeCareUseCasesCheckoutStateCommonModule } from '@de-care/de-care-use-cases/checkout/state-common';
import { DomainsUtilityStateIpLocationModule } from '@de-care/domains/utility/state-ip-location';
import { EffectsModule } from '@ngrx/effects';
import { Effects } from './state/effects';
import { DomainsOffersStateUpsellsWithCmsModule } from '@de-care/domains/offers/state-upsells-with-cms';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { setCanDisplayEarlyTerminationFeeCopies, setPaymentFormType } from './state/actions';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([Effects]),
        DeCareUseCasesCheckoutStateCommonModule,
        DomainsCmsStateCampaignsModule,
        DomainsOffersStateOffersWithCmsModule,
        DomainsOffersStatePackageDescriptionsModule,
        DomainsOffersStateUpsellsWithCmsModule,
        DomainsAccountStateAccountModule,
        DomainsQuotesStateQuoteModule,
        DomainsAccountStateSecurityQuestionsModule,
        DomainsUtilityStateIpLocationModule,
    ],
    providers: [Effects],
})
export class DeCareUseCasesCheckoutStateStreamingModule {
    constructor(readonly store: Store, @Inject(COUNTRY_SETTINGS) readonly countrySettings: CountrySettingsToken) {
        store.dispatch(setCanDisplayEarlyTerminationFeeCopies({ allowed: countrySettings?.countryCode?.toLowerCase() !== 'us' }));
        store.dispatch(setPaymentFormType({ paymentFormType: this.countrySettings?.countryCode?.toLowerCase() === 'ca' ? 'FULL' : 'BASIC' }));
    }
}
