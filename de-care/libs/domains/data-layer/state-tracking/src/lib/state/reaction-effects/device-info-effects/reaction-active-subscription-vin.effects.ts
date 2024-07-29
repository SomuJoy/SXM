import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReactionLookupByVinSuccess, behaviorEventReactionRflzDeviceInfoVin } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';
import { Injectable } from '@angular/core';
import { DataLayerService } from '../../../data-layer.service';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionActiveSubscriptionVinEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    lookupByVinSuccess$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionLookupByVinSuccess),
                tap(({ vin }) => this._dataLayerService.eventTrack('vin-lookup-success', { deviceInfo: { vin: vin } }))
            ),
        { dispatch: false }
    );

    effectRflzEligibilityCheck$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionRflzDeviceInfoVin),
                tap(({ vin }) => this._dataLayerService.eventTrack('rflz-eligibility-check', { deviceInfo: { vin: vin } }))
            ),
        { dispatch: false }
    );

    /**
     * @deprecated code will be removed once Adobe Launch is configured to use new event based system
     */
    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionRflzDeviceInfoVin, behaviorEventReactionLookupByVinSuccess),
                tap(({ vin }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.DeviceInfo, {
                        vin: vin,
                    });
                })
            ),
        { dispatch: false }
    );
}
