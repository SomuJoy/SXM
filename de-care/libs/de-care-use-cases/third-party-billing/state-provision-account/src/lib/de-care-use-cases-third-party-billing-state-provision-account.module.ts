import { NgModule } from '@angular/core';
import { DomainsIdentityStateThirdPartyBillingEntitlementModule } from '@de-care/domains/identity/state-third-party-billing-entitlement';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducers';
@NgModule({
    imports: [DomainsIdentityStateThirdPartyBillingEntitlementModule, StoreModule.forFeature(featureKey, reducer)]
})
export class DeCareUseCasesThirdPartyBillingStateProvisionAccountModule {}
