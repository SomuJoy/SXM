import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import {
    behaviorEventReactionAccountFromAcscTokenSuccess,
    behaviorEventReactionServiceContinuitySuccess,
    behaviorEventReactionAccountConsolidationSuccess,
    behaviorEventReactionAccountAcscSuccess,
} from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';

@Injectable({ providedIn: 'root' })
export class ReactionAcscSuccessEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    accountTokenSuccess$ = this._acscSuccessEffectsFactory(behaviorEventReactionAccountFromAcscTokenSuccess, 'acsc-account-token-success');
    serviceContinuitySuccess$ = this._acscSuccessEffectsFactory(behaviorEventReactionServiceContinuitySuccess, 'service-continuity-success');
    accountConsolidationSuccess$ = this._acscSuccessEffectsFactory(behaviorEventReactionAccountConsolidationSuccess, 'account-consolidation-success');
    accountAcscSuccess$ = this._acscSuccessEffectsFactory(behaviorEventReactionAccountAcscSuccess, 'acsc-account-success');

    private _acscSuccessEffectsFactory(actionType, eventTrackKey) {
        return createEffect(
            () =>
                this._actions$.pipe(
                    ofType(actionType),
                    tap(() => {
                        const pageData = this._legacyDataLayerService.getData(DataLayerDataTypeEnum.PageInfo);
                        const componentName = pageData.componentName;
                        this._legacyDataLayerService.explicitEventTrack(eventTrackKey, { componentName });
                    })
                ),
            { dispatch: false }
        );
    }
}
