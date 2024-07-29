import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';
import { EffectsModule } from '@ngrx/effects';
import { RequestCodeEffect } from './state/request-code.effect';
import { SharedStateSettingsModule } from '@de-care/shared/state-settings';
import { VerifyAccountService } from './data-services/verify-account.service';
import { SubmitVerifyAccountWorkflow } from './workflows/submit-verify-account.workflow';
import { DomainsDeviceStateDeviceRefreshModule } from '@de-care/domains/device/state-device-refresh';

@NgModule({
    imports: [StoreModule.forFeature(featureKey, reducer), EffectsModule.forFeature([RequestCodeEffect]), SharedStateSettingsModule, DomainsDeviceStateDeviceRefreshModule],
    providers: [VerifyAccountService, SubmitVerifyAccountWorkflow]
})
export class DomainsAccountStateTwoFactorAuthModule {}
