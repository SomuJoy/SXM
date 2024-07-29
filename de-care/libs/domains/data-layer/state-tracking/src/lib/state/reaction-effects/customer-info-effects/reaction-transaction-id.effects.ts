import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { behaviorEventReactionForTransactionId } from '@de-care/shared/state-behavior-events';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionTransactionIdEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService, private readonly _dataLayerService: DataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionForTransactionId),
                tap(({ transactionId }) => {
                    this._legacyDataLayerService.eventTrack('customerInfo', { transactionId });
                    this._dataLayerService.eventTrack('transaction-id-update', { transactionInfo: { transactionId } });
                })
            ),
        { dispatch: false }
    );
}
