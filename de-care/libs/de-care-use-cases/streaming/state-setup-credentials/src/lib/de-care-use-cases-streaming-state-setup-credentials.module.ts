import { NgModule } from '@angular/core';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsAccountStateSecurityQuestionsModule } from '@de-care/domains/account/state-security-questions';
import { DomainsCustomerStateAddressVerificationModule } from '@de-care/domains/customer/state-customer-verification';
import { DomainsIdentityStateStreamingFlepzLookupModule } from '@de-care/domains/identity/state-streaming-flepz-lookup';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LoadInboundQueryParamsEffects } from './state/load-inbound-query-params.effects';
import { featureKey, reducer } from './state/reducer';

@NgModule({
    imports: [
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([LoadInboundQueryParamsEffects]),
        DomainsOffersStatePackageDescriptionsModule,
        DomainsAccountStateAccountModule,
        DomainsAccountStateSecurityQuestionsModule,
        DomainsCustomerStateAddressVerificationModule,
        DomainsIdentityStateStreamingFlepzLookupModule,
    ],
})
export class DeCareUseCasesStreamingStateSetupCredentialsModule {}
