import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReactionCancelPlanReason, behaviorEventReactionCancelOnlineEligibilityInfo } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';
import { Injectable } from '@angular/core';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionCancelPlanReasonEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService, private readonly _dataLayerService: DataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionCancelPlanReason),
                tap(({ reason }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.PlanInfo, { cancelReason: reason });
                })
            ),
        { dispatch: false }
    );

    cancelOnlineEligibilityEffect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionCancelOnlineEligibilityInfo),
                tap(({ cancelOnlineEligibility }) => {
                    this._dataLayerService.eventTrack('cancel-online-start', { cancelOnlineEligibility });
                })
            ),
        { dispatch: false }
    );
}
