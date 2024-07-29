import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReactionPresentmentTestCellInfo } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionCancelPlanTestCellEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService, private readonly _dataLayerService: DataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionPresentmentTestCellInfo),
                tap(({ presentmentTestCell }) => {
                    this._legacyDataLayerService.eventTrack('presentment-test-cells', { presentmentTestCell });
                    this._dataLayerService.eventTrack('presentment-test-cells', { presentmentTestCell });
                })
            ),
        { dispatch: false }
    );
}
