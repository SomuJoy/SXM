import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    behaviorEventReactionActiveSubscriptionRadioId,
    behaviorEventReactionDeviceInfoEsn,
    behaviorEventReactionUsedCarEligibilityCheckRadioId,
} from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';
import { Injectable } from '@angular/core';
import { DataLayerService } from '../../../data-layer.service';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionActiveSubscriptionEsnEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    effectActiveSubscription$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionActiveSubscriptionRadioId),
                tap(({ radioId }) => this._dataLayerService.eventTrack('active-subscription', { deviceInfo: { esn: radioId } }))
            ),
        { dispatch: false }
    );

    effectUsedCarEligibilityCheck$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionUsedCarEligibilityCheckRadioId),
                tap(({ radioId }) => this._dataLayerService.eventTrack('used-car-eligibility-check', { deviceInfo: { esn: radioId } }))
            ),
        { dispatch: false }
    );

    effectDeviceInfoEsn$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionDeviceInfoEsn),
                tap(({ esn }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.DeviceInfo, {
                        esn,
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
                ofType(behaviorEventReactionActiveSubscriptionRadioId, behaviorEventReactionUsedCarEligibilityCheckRadioId),
                tap(({ radioId }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.DeviceInfo, {
                        esn: radioId,
                    });
                })
            ),
        { dispatch: false }
    );
}
