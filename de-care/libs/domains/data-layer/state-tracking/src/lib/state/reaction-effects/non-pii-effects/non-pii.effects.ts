import { Injectable } from '@angular/core';
import { DataLayerDataTypeEnum } from '../../../enums';
import {
    behaviorEventReactionNonPiiActiveSubscriptionId,
    behaviorEventReactionNonPiiClosedDeviceSubscriptionId,
    behaviorEventReactionNonPiiDevicePromoCode,
    behaviorEventReactionNonPiiMarketingId,
} from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';

@Injectable({
    providedIn: 'root',
})
export class NonPiiEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    devicePromoCode$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionNonPiiDevicePromoCode),
                tap(({ promoCode }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.DeviceInfo, { promoCode });
                })
            ),
        { dispatch: false }
    );

    activeSubscriptionIdEffect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionNonPiiActiveSubscriptionId),
                tap(({ id }) => {
                    const accountObj: any = this._legacyDataLayerService.getData(DataLayerDataTypeEnum.AccountData) || {};
                    // if account object already has a subscription entry then replace it with an object of just the subscription id being passed in
                    // otherwise create a new subscription array with the object with id as the first entry
                    accountObj?.subscriptions?.length > 0 ? (accountObj.subscriptions[0] = { id }) : (accountObj.subscriptions = [{ id }]);
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.AccountData, accountObj);
                })
            ),
        { dispatch: false }
    );

    marketingIdEffect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionNonPiiMarketingId),
                tap(({ marketingId, marketingAccountId: marketingAcctId }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.CustomerInfo, { marketingId, marketingAcctId });
                })
            ),
        { dispatch: false }
    );

    closedDeviceEffect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionNonPiiClosedDeviceSubscriptionId),
                tap(({ id: oldSubscriptionId }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.PlanInfo, { oldSubscriptionId });
                })
            ),
        { dispatch: false }
    );
}
