import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import {
    behaviorEventReactionAccountFromAcscTokenFailure,
    behaviorEventReactionServiceContinuityFailure,
    behaviorEventReactionAccountConsolidationFailure,
    behaviorEventReactionAccountAcscFailure,
} from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';

export enum AcScEventTrackKeyEnum {
    ACSC_TOKEN_FAILURE = 'acsc-account-token-failure',
    SC_FAILURE = 'service-continuity-failure',
    AC_FAILURE = 'account-consolidation-failure',
    ACSC_ACCOUNT_FAILURE = 'acsc-account-failure',
}

@Injectable({ providedIn: 'root' })
export class ReactionAcscFailureEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    accountTokenFailure$ = this._acscFailureEffectsFactory(behaviorEventReactionAccountFromAcscTokenFailure, AcScEventTrackKeyEnum.ACSC_TOKEN_FAILURE);
    serviceContinuityFailure$ = this._acscFailureEffectsFactory(behaviorEventReactionServiceContinuityFailure, AcScEventTrackKeyEnum.SC_FAILURE);
    accountConsolidationFailure$ = this._acscFailureEffectsFactory(behaviorEventReactionAccountConsolidationFailure, AcScEventTrackKeyEnum.AC_FAILURE);
    accountAcscFailure$ = this._acscFailureEffectsFactory(behaviorEventReactionAccountAcscFailure, AcScEventTrackKeyEnum.ACSC_ACCOUNT_FAILURE);

    private _acscFailureEffectsFactory(actionType, eventTrackKey: AcScEventTrackKeyEnum) {
        return createEffect(
            () =>
                this._actions$.pipe(
                    ofType(actionType),
                    tap((error) => {
                        if (eventTrackKey === AcScEventTrackKeyEnum.ACSC_TOKEN_FAILURE) {
                            this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.PageInfo, { flowName: 'scac', componentName: 'errorother' });
                        }
                        const pageData = this._legacyDataLayerService.getData(DataLayerDataTypeEnum.PageInfo);
                        const componentName = pageData.componentName;
                        this._legacyDataLayerService.explicitEventTrack(eventTrackKey, { componentName, error });
                    })
                ),
            { dispatch: false }
        );
    }
}
