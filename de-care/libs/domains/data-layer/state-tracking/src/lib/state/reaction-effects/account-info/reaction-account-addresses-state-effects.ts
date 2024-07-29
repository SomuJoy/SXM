import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { behaviorEventReactionForAccountAddressesState } from '@de-care/shared/state-behavior-events';
import { Injectable } from '@angular/core';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionForAccountAddressesStateEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionForAccountAddressesState),
                tap(({ serviceAddressState, billingAddressState }) => {
                    this._dataLayerService.eventTrack('customer-info', {
                        serviceAddressState,
                        billingAddressState,
                    });
                })
            ),
        { dispatch: false }
    );
}
