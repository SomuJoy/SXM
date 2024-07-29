import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReactionNewSubscriptionId } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';
import { Injectable } from '@angular/core';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionSubscriptionIdEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionNewSubscriptionId),
                tap(({ id }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.DeviceInfo, {
                        id,
                    });
                })
            ),
        { dispatch: false }
    );
}
