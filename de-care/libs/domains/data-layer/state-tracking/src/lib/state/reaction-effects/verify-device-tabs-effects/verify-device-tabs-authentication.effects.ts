import { Injectable } from '@angular/core';
import { DataLayerDataTypeEnum } from '../../../enums';
import {
    behaviorEventReactionCustomerInfoAuthenticationType,
    behaviorEventReactionLookupAuthenticationFailure,
    behaviorEventReactionLookupByAccountNumberAndRadioIdFailure,
    behaviorEventReactionLookupByAccountNumberAndRadioIdSuccess,
    behaviorEventReactionLookupByAccountNumberFailure,
    behaviorEventReactionLookupByAccountNumberSuccess,
    behaviorEventReactionLookupByFlepzFailure,
    behaviorEventReactionLookupByFlepzSuccess,
    behaviorEventReactionLookupByLicensePlateFailure,
    behaviorEventReactionLookupByLicensePlateSuccess,
    behaviorEventReactionLookupByLoginFailure,
    behaviorEventReactionLookupByLoginSuccess,
    behaviorEventReactionLookupByRadioIdFailure,
    behaviorEventReactionLookupByRadioIdSuccess,
    behaviorEventReactionLookupByVinFailure,
    behaviorEventReactionLookupByVinSuccess,
    behaviorEventReactionAuthenticationByRadioVerifyFailure,
    behaviorEventReactionAuthenticationByRadioVerifySuccess,
    behaviorEventReactionAuthenticationSuccess,
    behaviorEventReactionAuthenticationByFlepzSuccess,
    behaviorEventReactionAuthenticationByFlepzFailure,
    behaviorEventReactionAuthenticationByAccountNumberAndRadioIdSuccess,
    behaviorEventReactionAuthenticationByLoginSuccess,
} from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class VerifyDeviceTabsAuthenticationEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    lookupByRadioSuccess$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventReactionLookupByRadioIdSuccess),
            map(() => behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'RID' }))
        )
    );

    lookupByAccountNumberAndRadioIdSuccess$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventReactionLookupByAccountNumberAndRadioIdSuccess),
            map(() => behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'RID_ACCT' }))
        )
    );

    lookupByAccountNumberSuccess$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventReactionLookupByAccountNumberSuccess),
            map(() => behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'ACCT' }))
        )
    );

    lookupByLoginSuccess$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventReactionLookupByLoginSuccess),
            map(() => behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'LOGIN' }))
        )
    );

    lookupByFlepzSuccess$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventReactionLookupByFlepzSuccess),
            map(() => behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'FLEPZ' }))
        )
    );

    lookupByVinSuccess$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventReactionLookupByVinSuccess),
            map(() => behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'VIN' }))
        )
    );

    lookupByLicensePlateSuccess$ = createEffect(() =>
        this._actions$.pipe(
            ofType(behaviorEventReactionLookupByLicensePlateSuccess),
            map(() => behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'LPL' }))
        )
    );

    authenticationTypesSuccess$ = createEffect(() =>
        this._actions$.pipe(
            ofType(
                behaviorEventReactionAuthenticationByRadioVerifySuccess,
                behaviorEventReactionAuthenticationByFlepzSuccess,
                behaviorEventReactionAuthenticationByAccountNumberAndRadioIdSuccess,
                behaviorEventReactionAuthenticationByLoginSuccess
            ),
            map(() => behaviorEventReactionAuthenticationSuccess())
        )
    );

    authenticationSucess$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionAuthenticationSuccess),
                tap(() => this._legacyDataLayerService.explicitEventTrack('authentication-success', null))
            ),
        { dispatch: false }
    );

    lookupAuthTypesFailure$ = createEffect(() =>
        this._actions$.pipe(
            ofType(
                behaviorEventReactionLookupByRadioIdFailure,
                behaviorEventReactionLookupByAccountNumberFailure,
                behaviorEventReactionLookupByLoginFailure,
                behaviorEventReactionLookupByFlepzFailure,
                behaviorEventReactionLookupByVinFailure,
                behaviorEventReactionLookupByLicensePlateFailure,
                behaviorEventReactionLookupByAccountNumberAndRadioIdFailure,
                behaviorEventReactionAuthenticationByRadioVerifyFailure,
                behaviorEventReactionAuthenticationByFlepzFailure
            ),
            map(() => behaviorEventReactionLookupAuthenticationFailure())
        )
    );

    authenticationFailure$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionLookupAuthenticationFailure),
                tap(() => {
                    const pageData = this._legacyDataLayerService.getData(DataLayerDataTypeEnum.PageInfo);
                    const componentName = pageData.componentName;
                    this._legacyDataLayerService.explicitEventTrack('authentication-failure', { componentName });
                })
            ),
        { dispatch: false }
    );
}
