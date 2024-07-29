import { Injectable } from '@angular/core';
import { behaviorEventReactionForPrepaidBin } from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionPrepaidBinEffect {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionForPrepaidBin),
                tap(({ prePaidBin }) => {
                    this._dataLayerService.eventTrack('account-info', {
                        cardInfo: { prepaidCard: prePaidBin },
                    });
                })
            ),
        { dispatch: false }
    );
}
