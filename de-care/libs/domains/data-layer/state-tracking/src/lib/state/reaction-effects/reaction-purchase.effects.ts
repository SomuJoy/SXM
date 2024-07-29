import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataLayerService } from '../../data-layer.service';
import { behaviorEventReactionGiftCardUsedDuringPurchase } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ReactionPurchaseEffects {
    constructor(private readonly _actions$: Actions, private readonly _data: DataLayerService) {}

    giftCardUsed$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionGiftCardUsedDuringPurchase),
                tap(() => this._data.eventTrack('gift-card-used'))
            ),
        { dispatch: false }
    );
}
