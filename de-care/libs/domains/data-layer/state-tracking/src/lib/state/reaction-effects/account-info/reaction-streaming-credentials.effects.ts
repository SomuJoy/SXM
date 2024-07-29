import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataLayerService } from '../../../data-layer.service';
import { tap } from 'rxjs/operators';
import { behaviorEventReactionStreamingCredentialsUpdated } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class ReactionStreamingCredentialsEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionStreamingCredentialsUpdated),
                tap(() => {
                    this._dataLayerService.eventTrack('streaming-credentials-updated');
                })
            ),
        { dispatch: false }
    );
}
