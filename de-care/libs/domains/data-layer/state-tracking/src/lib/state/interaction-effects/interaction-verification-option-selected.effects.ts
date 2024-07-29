import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { behaviorEventInteractionContinueVerifyOptionSelected } from '@de-care/shared/state-behavior-events';
import { LegacyDataLayerService } from '../../legacy-data-layer.service';
import { DataLayerDataTypeEnum } from '../../enums';

@Injectable({ providedIn: 'root' })
export class InteractionVerificationOptionSelectedEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventInteractionContinueVerifyOptionSelected),
                tap(({ selectedVerificationOption }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.PageInfo, {
                        selectedVerificationOption,
                    });
                })
            ),
        { dispatch: false }
    );
}
