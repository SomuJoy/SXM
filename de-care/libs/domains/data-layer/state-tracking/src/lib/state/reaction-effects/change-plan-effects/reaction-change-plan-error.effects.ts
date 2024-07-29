import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import { behaviorEventReactionChangeSubscriptionFailure } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';

@Injectable({ providedIn: 'root' })
export class ReactionChangePlanEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    changeSubscriptionFailure$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionChangeSubscriptionFailure),
                tap((error) => {
                    const pageData = this._legacyDataLayerService.getData(DataLayerDataTypeEnum.PageInfo);
                    const componentName = pageData.componentName;
                    this._legacyDataLayerService.explicitEventTrack('change-subscription-failure', { componentName, error });
                })
            ),
        { dispatch: false }
    );
}
