import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import { behaviorEventReactionAcscOffersFailure } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { DataLayerDataTypeEnum } from '../../../enums';

@Injectable({ providedIn: 'root' })
export class ReactionAcscOffersEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionAcscOffersFailure),
                tap((error) => {
                    const pageData = this._legacyDataLayerService.getData(DataLayerDataTypeEnum.PageInfo);
                    const componentName = pageData.componentName;
                    this._legacyDataLayerService.explicitEventTrack('acsc-offers-failure', { componentName, error });
                })
            ),
        { dispatch: false }
    );
}
