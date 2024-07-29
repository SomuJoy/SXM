import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReactionThirdPartyBillingResellerInfo } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';
import { Injectable } from '@angular/core';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionTpbResellerInfo {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionThirdPartyBillingResellerInfo),
                tap(({ resellerCode, partnerName }) => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.PageInfo, {
                        tpbResellerInfo: {
                            resellerCode,
                            partnerName,
                        },
                    });
                })
            ),
        { dispatch: false }
    );
}
