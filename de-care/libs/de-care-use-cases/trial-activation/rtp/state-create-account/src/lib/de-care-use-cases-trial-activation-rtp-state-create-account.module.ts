import { DomainsDeviceStateDeviceInfoModule } from '@de-care/domains/device/state-device-info';
import { DomainsDeviceStateDeviceValidateModule } from '@de-care/domains/device/state-device-validate';
import { DomainsAccountStateSessionDataModule } from '@de-care/domains/account/state-session-data';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { DomainsOffersStateOffersModule } from '@de-care/domains/offers/state-offers';
import { SharedStateSettingsModule } from '@de-care/settings';
import { EffectsModule } from '@ngrx/effects';
import { CreateAccountEffects } from './state/effects';
import { reducer, featureKey } from './state/reducer';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        DomainsAccountStateAccountModule,
        DomainsOffersStateOffersModule,
        EffectsModule.forFeature([CreateAccountEffects]),
        StoreModule.forFeature(featureKey, reducer),
        SharedStateSettingsModule,
        DomainsAccountStateSessionDataModule,
        DomainsDeviceStateDeviceInfoModule,
        DomainsDeviceStateDeviceValidateModule
    ]
})
export class DeCareUseCasesTrialActivationRtpStateCreateAccountModule {}
