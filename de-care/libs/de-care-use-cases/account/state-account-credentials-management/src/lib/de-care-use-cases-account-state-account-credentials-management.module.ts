import { DomainsCustomerStateAddressVerificationModule } from '@de-care/domains/customer/state-customer-verification';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DomainsAccountStateCustomerAccountsModule } from '@de-care/domains/account/state-customer-accounts';
import { SharedStateSettingsModule } from '@de-care/shared/state-settings';
import { StoreModule } from '@ngrx/store';
import { reducer, featureKey } from './state/reducer';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsIdentityStateCredentialsRecoveryModule } from '@de-care/domains/identity/state-credentials-recovery';
import { LoadInboundQueryParamsEffects } from './state/load-inbound-query-params.effects';
import { EffectsModule } from '@ngrx/effects';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';

@NgModule({
    imports: [
        EffectsModule.forFeature([LoadInboundQueryParamsEffects]),
        RouterModule,
        SharedStateSettingsModule,
        DomainsOffersStatePackageDescriptionsModule,
        DomainsAccountStateCustomerAccountsModule,
        DomainsCustomerStateAddressVerificationModule,
        DomainsAccountStateAccountModule,
        StoreModule.forFeature(featureKey, reducer),
        DomainsIdentityStateCredentialsRecoveryModule,
    ],
})
export class DeCareUseCasesAccountStateAccountCredentialsManagementModule {}
