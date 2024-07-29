import { Injectable } from '@angular/core';
import {
    behaviorEventErrorFromUserInteraction,
    behaviorEventReactionAuthenticationSuccess,
    behaviorEventReactionCustomerFlepzLookupFailure,
    behaviorEventReactionCustomerFlepzLookupReturnedNoSubscriptions,
    behaviorEventReactionCustomerFlepzLookupReturnedSubscriptions,
    behaviorEventReactionCustomerFlepzLookupSuccess,
    behaviorEventReactionCustomerInfoAuthenticationType,
    behaviorEventReactionFlepzFormClientSideValidationErrors,
    behaviorEventReactionLookupAuthenticationFailure
} from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { flatMap, map, tap } from 'rxjs/operators';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class FlepzLookupEffectsService {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}

    clientSideValidationFailedEffect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionFlepzFormClientSideValidationErrors),
                tap(({ errors }) => {
                    this._dataLayerService.frontEndErrorsTrack(errors);
                })
            ),
        { dispatch: false }
    );

    clientSideValidationFailedEffectLegacy$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventReactionFlepzFormClientSideValidationErrors),
            flatMap(({ errors }) => {
                return errors.map(error => behaviorEventErrorFromUserInteraction({ message: error }));
            })
        )
    );

    customerFlepzLookupSuccess$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventReactionCustomerFlepzLookupSuccess),
            map(() => behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'FLEPZ' }))
        )
    );

    customerFlepzLookupFailure$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventReactionCustomerFlepzLookupFailure),
            map(() => behaviorEventReactionLookupAuthenticationFailure())
        )
    );

    customerFlepzLookupReturnedSubscriptions$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventReactionCustomerFlepzLookupReturnedSubscriptions),
            map(() => behaviorEventReactionAuthenticationSuccess())
        )
    );

    customerFlepzLookupReturnedNoSubscriptions$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventReactionCustomerFlepzLookupReturnedNoSubscriptions),
            map(() => behaviorEventReactionLookupAuthenticationFailure())
        )
    );
}
