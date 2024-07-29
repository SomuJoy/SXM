import { Injectable } from '@angular/core';
import { behaviorEventReactionForUpsells } from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionUpsellsEffect {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionForUpsells),
                tap(({ upsellOffers }) => {
                    this._dataLayerService.eventTrack('upsells', upsellOffers);
                })
            ),
        { dispatch: false }
    );
}
