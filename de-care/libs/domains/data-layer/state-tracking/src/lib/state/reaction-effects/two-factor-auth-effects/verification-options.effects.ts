import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReactionVerificationMethods } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';
import { Injectable } from '@angular/core';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionVerificationOptionsEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionVerificationMethods),
                tap(({ verificationOptions }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.PageInfo, {
                        verificationOptions,
                    });
                })
            ),
        { dispatch: false }
    );
}
