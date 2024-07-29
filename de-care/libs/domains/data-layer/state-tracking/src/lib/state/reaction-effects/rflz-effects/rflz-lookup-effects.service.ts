import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataLayerService } from '../../../data-layer.service';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import {
    behaviorEventErrorFromUserInteraction,
    behaviorEventImpressionForPage,
    behaviorEventReactionRflzFormClientSideValidationErrors,
    behaviorEventReactionRflzLookupFailure,
    behaviorEventReactionRflzLookupSuccess,
} from '@de-care/shared/state-behavior-events';
import { filter, flatMap, tap } from 'rxjs/operators';
import { AuthenticationTypeEnum, DataLayerActionEnum, DataLayerDataTypeEnum } from '../../../enums';

@Injectable({ providedIn: 'root' })
export class RflzLookupEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    pageEffectNew$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventImpressionForPage),
                filter(({ pageKey, componentKey }) => pageKey === 'AUTHENTICATE' && componentKey === 'rflzLookup'),
                tap(() => this._dataLayerService.eventTrack('rflz-loaded'))
            ),
        { dispatch: false }
    );

    /**
     * @deprecated code will be removed once Adobe Launch is configured to use new event based system
     */
    pageEffect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventImpressionForPage),
                filter(({ pageKey, componentKey }) => pageKey === 'AUTHENTICATE' && componentKey === 'rflzLookup'),
                tap(({ pageKey, componentKey }) => {
                    this._legacyDataLayerService.explicitEventTrack(DataLayerActionEnum.RflzLoaded, { componentName: componentKey });
                })
            ),
        { dispatch: false }
    );

    successEffectNew$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionRflzLookupSuccess),
                tap(({ componentKey }) => this._dataLayerService.eventTrack('rflz-successful', { customerInfo: { authenticationType: 'RFLZ' } }))
            ),
        { dispatch: false }
    );

    /**
     * @deprecated code will be removed once Adobe Launch is configured to use new event based system
     */
    successEffect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionRflzLookupSuccess),
                tap(({ componentKey }) => {
                    this._legacyDataLayerService.explicitEventTrack(DataLayerActionEnum.RflzSuccessful, { componentName: componentKey });
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.CustomerInfo, {
                        authenticationType: AuthenticationTypeEnum.Rflz,
                    });
                })
            ),
        { dispatch: false }
    );

    failureEffectNew$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionRflzLookupFailure),
                tap(({ componentKey }) => this._dataLayerService.eventTrack('rflz-failed', { componentName: componentKey }))
            ),
        { dispatch: false }
    );

    /**
     * @deprecated code will be removed once Adobe Launch is configured to use new event based system
     */
    failureEffect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionRflzLookupFailure),
                tap(({ componentKey }) => {
                    this._legacyDataLayerService.explicitEventTrack(DataLayerActionEnum.RflzFailed, { componentName: componentKey });
                })
            ),
        { dispatch: false }
    );

    clientSideValidationFailedEffectNew$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionRflzFormClientSideValidationErrors),
                tap(({ errors }) => {
                    this._dataLayerService.frontEndErrorsTrack(errors);
                    this._dataLayerService.eventTrack('rflz-form-invalid-input');
                })
            ),
        { dispatch: false }
    );

    /**
     * @deprecated code will be removed once Adobe Launch is configured to use new event based system
     */
    clientSideValidationFailedEffect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventReactionRflzFormClientSideValidationErrors),
            flatMap(({ errors }) => {
                return errors.map((error) => behaviorEventErrorFromUserInteraction({ message: error }));
            })
        )
    );
}
