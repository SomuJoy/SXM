import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducer, offerRenewalFeatureKey } from './state/reducer';

@NgModule({
    imports: [StoreModule.forFeature(offerRenewalFeatureKey, reducer)]
})
export class DomainsOffersStateRenewalsModule {}
