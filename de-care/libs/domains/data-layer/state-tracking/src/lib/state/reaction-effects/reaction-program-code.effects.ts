import { DataLayerDataTypeEnum } from '../../enums';
import { Injectable } from '@angular/core';
import { behaviorEventReactionForProgramCode } from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { LegacyDataLayerService } from '../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionProgramCodeEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionForProgramCode),
                tap(({ programCode }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.DeviceInfo, { programCode });
                })
            ),
        { dispatch: false }
    );
}
