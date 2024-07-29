import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import {
    behaviorEventReactionAuthenticationStatusAuthenticated,
    behaviorEventReactionAuthenticationStatusIdentified,
    behaviorEventReactionAuthenticationStatusUnidentified,
} from '@de-care/shared/state-behavior-events';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import { DataLayerDataTypeEnum } from '../../../enums';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationStatusEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService, private readonly _dataLayerService: DataLayerService) {}

    authenticatedEffect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionAuthenticationStatusAuthenticated),
                tap(() => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.CustomerInfo, {
                        authenticationStatus: {
                            status: 'Authenticated users',
                        },
                    });
                    this._dataLayerService.eventTrack(DataLayerDataTypeEnum.CustomerInfo, {
                        authenticationStatus: {
                            status: 'Authenticated users',
                        },
                    });
                })
            ),
        { dispatch: false }
    );

    identifiedEffect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionAuthenticationStatusIdentified),
                tap(() => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.CustomerInfo, {
                        authenticationStatus: {
                            status: 'Identified users',
                        },
                    });
                    this._dataLayerService.eventTrack(DataLayerDataTypeEnum.CustomerInfo, {
                        authenticationStatus: {
                            status: 'Identified users',
                        },
                    });
                })
            ),
        { dispatch: false }
    );

    unidentifiedEffect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionAuthenticationStatusUnidentified),
                tap(() => {
                    this._legacyDataLayerService.eventTrack(DataLayerDataTypeEnum.CustomerInfo, {
                        authenticationStatus: {
                            status: 'Unidentified users',
                        },
                    });
                    this._dataLayerService.eventTrack(DataLayerDataTypeEnum.CustomerInfo, {
                        authenticationStatus: {
                            status: 'Unidentified users',
                        },
                    });
                })
            ),
        { dispatch: false }
    );
}
