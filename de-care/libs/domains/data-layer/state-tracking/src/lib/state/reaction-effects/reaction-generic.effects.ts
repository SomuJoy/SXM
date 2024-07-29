import { Injectable } from '@angular/core';
import { genericBehaviorEventReaction } from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { LegacyDataLayerService } from '../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionGenericEffects {
    constructor(private readonly _actions$: Actions, private _legacyDataLayerService: LegacyDataLayerService) {}

    genericEventReaction$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(genericBehaviorEventReaction),
                tap(({ dataLayerKeyToUpdate, dataLayerPayloadToUpdate, eventAction, eventData }) => {
                    this._legacyDataLayerService.eventTrackWithDataLayerUpdate(dataLayerKeyToUpdate, dataLayerPayloadToUpdate, eventAction, eventData);
                })
            ),
        { dispatch: false }
    );
}
