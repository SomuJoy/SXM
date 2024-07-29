import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import {
    behaviorEventReactionAcscNumberOfScEligibleDevices,
    behaviorEventReactionAcscTrialPackageName,
    behaviorEventReactionSwapRadioIdToMarketingId,
} from '@de-care/shared/state-behavior-events';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import { DataLayerDataTypeEnum } from '../../../enums';

@Injectable({ providedIn: 'root' })
export class AcscEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    reactionNumberOfScEligibleDevicesEffects$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionAcscNumberOfScEligibleDevices),
                tap(({ numberScEligibleDevices }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.CustomerInfo, {
                        numberScEligibleDevices,
                    });
                })
            ),
        { dispatch: false }
    );

    reactionTrialPackageNameEffects$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionAcscTrialPackageName),
                tap(({ trialPackageName }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.CustomerInfo, {
                        trialPackageName,
                    });
                })
            ),
        { dispatch: false }
    );

    swapRadioIdToMarketingId$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionSwapRadioIdToMarketingId),
                tap(({ marketingId }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.CustomerInfo, {
                        marketingId,
                    });
                })
            ),
        { dispatch: false }
    );
}
