import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import {
    behaviorEventErrorFromAppCode,
    behaviorEventErrorFromBusinessLogic,
    behaviorEventErrorFromHttpCall,
    behaviorEventErrorFromSystem,
    behaviorEventErrorFromUserInteraction,
    behaviorEventErrorsFromUserInteraction
} from '@de-care/shared/state-behavior-events';
import { DataLayerService } from '../../data-layer.service';
import { LegacyDataLayerService } from '../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class ErrorEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    errorsFromUserInteraction$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventErrorsFromUserInteraction),
                tap(({ errors }) => {
                    this._dataLayerService.frontEndErrorsTrack(errors);
                })
            ),
        { dispatch: false }
    );
    /**
     * @deprecated code will be removed once Adobe Launch is configured to use new event based system
     */
    errorsFromUserInteractionLegacy$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventErrorsFromUserInteraction),
                tap(({ errors }) => {
                    errors.forEach(message => this._legacyDataLayerService.frontEndErrorTrack(message));
                })
            ),
        { dispatch: false }
    );

    errorFromUserInteraction$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventErrorFromUserInteraction),
                tap(({ message }) => {
                    this._legacyDataLayerService.frontEndErrorTrack(message);
                })
            ),
        { dispatch: false }
    );

    errorFromBusinessLogic$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventErrorFromBusinessLogic),
                tap(({ message, errorCode }) => {
                    this._legacyDataLayerService.businessErrorTrack(message);
                    this._dataLayerService.businessErrorTrack({ errorType: 'BUSINESS', errorName: message, errorCode: errorCode });
                })
            ),
        { dispatch: false }
    );

    errorFromHttpCall$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventErrorFromHttpCall),
                tap(({ error }) => {
                    this._legacyDataLayerService.httpCallErrorTrack(error);
                })
            ),
        { dispatch: false }
    );

    errorFromApp$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventErrorFromAppCode),
                tap(({ error }) => {
                    this._legacyDataLayerService.appErrorTrack(error);
                })
            ),
        { dispatch: false }
    );

    errorFromSystem$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventErrorFromSystem),
                tap(({ message, errorCode }) => {
                    this._dataLayerService.systemErrorTrack({ errorType: 'SYSTEM', errorName: message, errorCode: errorCode });
                })
            ),
        { dispatch: false }
    );
}
