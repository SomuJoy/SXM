import { Injectable } from '@angular/core';
import { behaviorEventReactionTokenForSubscriptionGenerationFailure, behaviorEventReactionTokenForSubscriptionGenerationSuccess } from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class TokenForSubscriptionGenerationEffects {
    constructor(private readonly _actions$: Actions, private _dataLayerService: DataLayerService) {}

    tokenForSubscriptionGenerationEventReaction$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionTokenForSubscriptionGenerationSuccess),
                tap(() => {
                    this._dataLayerService.eventTrack('token-generation-success');
                })
            ),
        { dispatch: false }
    );

    tokenForSubscriptionGenerationEventReactionFailure$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionTokenForSubscriptionGenerationFailure),
                tap(({ failure }) => {
                    this._dataLayerService.businessErrorTrack({ errorType: 'BUSINESS', errorName: 'token-generation-failure', errorCode: failure });
                })
            ),
        { dispatch: false }
    );
}
