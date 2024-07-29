import { Injectable } from '@angular/core';
import { behaviorEventReactionCardBinRangesLoaded } from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { DataLayerService } from '../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionCardBinRangesEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}

    cardBinRangesLoaded$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionCardBinRangesLoaded),
                tap(({ binRangeNames }) => this._dataLayerService.eventTrack('card-bin-ranges-loaded', { binRangeNames }))
            ),
        { dispatch: false }
    );
}
