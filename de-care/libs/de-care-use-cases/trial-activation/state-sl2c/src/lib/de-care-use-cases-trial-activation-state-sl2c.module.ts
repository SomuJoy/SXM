import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsCustomerStateLocaleModule } from '@de-care/domains/customer/state-locale';
import { SharedStateSettingsModule } from '@de-care/shared/state-settings';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Sl2CEffects } from './state/effects';
import { featureKey, reducer } from './state/reducer';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';

@NgModule({
    imports: [
        CommonModule,
        SharedStateSettingsModule,
        StoreModule.forFeature(featureKey, reducer),
        DomainsCustomerStateLocaleModule,
        DomainsAccountStateAccountModule,
        EffectsModule.forFeature([Sl2CEffects]),
        DomainsOffersStateOffersWithCmsModule
    ]
})
export class DeCareUseCasesTrialActivationStateSl2cModule {}
