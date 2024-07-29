import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import {
    behaviorEventReactionUseCaseExperienceRequested,
    behaviorEventReactionUseCaseExperienceStarted,
    behaviorEventReactionFeatureTransactionStarted,
} from '@de-care/shared/state-behavior-events';
import { DataLayerService } from '../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionUseCaseRoutingEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}

    useCaseExperienceRequested$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionUseCaseExperienceRequested),
                tap(({ useCase, experience }) => {
                    // TODO: capture in data layer
                })
            ),
        { dispatch: false }
    );

    useCaseExperienceStarted$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionUseCaseExperienceStarted),
                tap(({ useCase, experience }) => {
                    // TODO: capture in data layer
                })
            ),
        { dispatch: false }
    );

    flowStarted$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionFeatureTransactionStarted),
                tap(({ flowName, flowVariation }) => {
                    this._dataLayerService.eventTrack('flow-started', { flowInfo: { flowName: flowName, flowVariation: flowVariation } });
                })
            ),
        { dispatch: false }
    );
}
