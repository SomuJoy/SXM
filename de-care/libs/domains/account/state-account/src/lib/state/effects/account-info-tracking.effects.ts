import { Injectable } from '@angular/core';
import { behaviorEventReactionDeviceInfo, behaviorEventReactionDevicePromoCode } from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map } from 'rxjs/operators';
import { setAccount } from '../actions';

@Injectable()
export class AccountInfoTrackingEffects {
    constructor(private _actions$: Actions) {}

    devicePromoCodeSubscriptionEffects$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setAccount),
            map((action) => action.account),
            filter((account) => !!(Array.isArray(account?.subscriptions) && account?.subscriptions?.length > 0 && account?.subscriptions[0].radioService?.radioId)),
            map((account) => account?.subscriptions[0].devicePromoCode),
            map((devicePromoCode) => behaviorEventReactionDevicePromoCode({ devicePromoCode }))
        )
    );

    deviceInfoVehicleInfoEffects$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setAccount),
            map((action) => action.account),
            map((account) => account?.subscriptions?.[0]?.radioService || account?.closedDevices?.[0]),
            filter((deviceInfo) => !!deviceInfo),
            map((deviceInfo) => behaviorEventReactionDeviceInfo({ esn: deviceInfo.last4DigitsOfRadioId, vehicleInfo: deviceInfo.vehicleInfo }))
        )
    );

    devicePromoCodeClosedDeviceEffects$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setAccount),
            map((action) => action.account),
            filter((account) => !!(Array.isArray(account?.closedDevices) && account?.closedDevices?.length > 0 && account?.closedDevices[0].last4DigitsOfRadioId)),
            map((account) => account?.closedDevices[0].devicePromoCode),
            map((devicePromoCode) => behaviorEventReactionDevicePromoCode({ devicePromoCode }))
        )
    );
}
