import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TrialActivationRTPEffects } from './state/effects';
import { featureKey, reducer } from './state/reducer';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { SharedStateSettingsModule } from '@de-care/shared/state-settings';
import { DomainsUtilityStateEnvironmentInfoModule } from '@de-care/domains/utility/state-environment-info';
import { DomainsDeviceStateDeviceValidateModule } from '@de-care/domains/device/state-device-validate';
import { DomainsCustomerStateLocaleModule } from '@de-care/domains/customer/state-locale';
import { DomainsSubscriptionsStateNewAccountModule } from '@de-care/domains/subscriptions/state-new-account';
import { DomainsOffersStateOffersWithCmsModule } from '@de-care/domains/offers/state-offers-with-cms';
@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature(featureKey, reducer),
        EffectsModule.forFeature([TrialActivationRTPEffects]),
        DomainsQuotesStateQuoteModule,
        DomainsAccountStateAccountModule,
        DomainsSubscriptionsStateNewAccountModule,
        SharedStateSettingsModule,
        DomainsUtilityStateEnvironmentInfoModule,
        DomainsDeviceStateDeviceValidateModule,
        DomainsCustomerStateLocaleModule,
        DomainsOffersStateOffersWithCmsModule
    ]
})
export class DeCareUseCasesTrialActivationRtpStateSharedModule {}
