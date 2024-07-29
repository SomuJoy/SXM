import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { behaviorEventReactionFordtok } from '@de-care/shared/state-behavior-events';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class DirectBillingDtokInfoEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}
    effectEligibilityCheck$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionFordtok),
                tap(({ dtok: type }) => this._dataLayerService.eventTrack('customer-authenticated', { customerInfo: { dtok: type } }))
            ),
        { dispatch: false }
    );
}
