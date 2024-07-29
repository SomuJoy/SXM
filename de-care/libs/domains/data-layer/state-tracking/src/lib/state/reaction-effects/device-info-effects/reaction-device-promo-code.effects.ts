import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    behaviorEventReactionUsedCarEligibilityCheckDevicePromoCode,
    behaviorEventReactionFirstOfferDevicePromoCode,
    behaviorEventReactionDevicePromoCode,
} from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';
import { Injectable } from '@angular/core';
import { DataLayerService } from '../../../data-layer.service';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionDevicePromoCodeEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    effectEligibilityCheck$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionUsedCarEligibilityCheckDevicePromoCode),
                tap(({ devicePromoCode: promoCode }) => this._dataLayerService.eventTrack('used-car-eligibility-check', { deviceInfo: { promoCode } }))
            ),
        { dispatch: false }
    );

    effectDevicePromoCode$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionDevicePromoCode),
                tap(({ devicePromoCode }) => {
                    //TODO: Still using legacy Data Layer.
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.DeviceInfo, {
                        devicePromoCode,
                    });
                })
            ),
        { dispatch: false }
    );

    /**
     * @deprecated code will be removed once Adobe Launch is configured to use new event based system
     */
    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionUsedCarEligibilityCheckDevicePromoCode, behaviorEventReactionFirstOfferDevicePromoCode),
                tap(({ devicePromoCode: promoCode }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.DeviceInfo, {
                        promoCode,
                    });
                })
            ),
        { dispatch: false }
    );
}
