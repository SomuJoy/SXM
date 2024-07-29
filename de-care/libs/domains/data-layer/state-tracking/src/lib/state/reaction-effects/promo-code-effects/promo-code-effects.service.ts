import { Injectable } from '@angular/core';
import {
    behaviorEventImpressionForComponent,
    behaviorEventReactionPromoCodeValidationSuccess,
    behaviorEventReactionPromoCodeValidationFailure,
} from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, tap } from 'rxjs/operators';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import { DataLayerActionEnum } from '../../../enums';

@Injectable({ providedIn: 'root' })
export class PromoCodeEffectsService {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    pageEffect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventImpressionForComponent),
                filter(({ componentName }) => componentName === 'promoCodeEntry'),
                tap(({ componentName }) => {
                    this._legacyDataLayerService.explicitEventTrack(DataLayerActionEnum.PromoCodeFormLoaded, { componentName: componentName });
                })
            ),
        { dispatch: false }
    );

    successEffect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionPromoCodeValidationSuccess),
                tap(({ componentName }) => {
                    this._legacyDataLayerService.explicitEventTrack(DataLayerActionEnum.PromoCodeSuccessful, { componentName: componentName });
                })
            ),
        { dispatch: false }
    );

    failureEffect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionPromoCodeValidationFailure),
                tap(({ componentName }) => {
                    this._legacyDataLayerService.explicitEventTrack(DataLayerActionEnum.PromoCodeFailed, { componentName: componentName });
                })
            ),
        { dispatch: false }
    );
}
