import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CHECKOUT_CONSTANT } from './config';
import { checkoutReducer, StoreCheckoutsEffects } from './store';
import { RTCCheckoutEffects } from './store/rtc.effects';
import { EnvironmentInfoEffects } from './store/environment-info.effects';

@NgModule({
    imports: [
        StoreModule.forFeature(CHECKOUT_CONSTANT.STORE.NAME, checkoutReducer),
        EffectsModule.forFeature([StoreCheckoutsEffects, RTCCheckoutEffects, EnvironmentInfoEffects])
    ]
})
export class CheckoutStateModule {}
