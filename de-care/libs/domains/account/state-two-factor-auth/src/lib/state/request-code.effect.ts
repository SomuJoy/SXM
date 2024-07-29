import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, filter } from 'rxjs/operators';
import {
    phoneVerificationComplete,
    requestPhoneVerification,
    setPhoneVerificationRequestCodeStatus,
    setPhoneVerificationRequestCodeLimitExceeded,
    setSecurityCodeVerificationCompleted,
} from './actions';
import { RequestVerifyByPhoneWorkflow, RequestVerifyByPhoneStatus } from '../workflows/request-verify-by-phone.workflow';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class RequestCodeEffect {
    constructor(private readonly _actions: Actions, private readonly _requestVerifyByPhone: RequestVerifyByPhoneWorkflow, private _store: Store) {}

    requestPhoneVerification$ = createEffect(() =>
        this._actions.pipe(
            ofType(requestPhoneVerification),
            switchMap(({ phoneNumber, locale }) => this._requestVerifyByPhone.build({ phoneNumber, langPref: locale })),
            map((status) => setPhoneVerificationRequestCodeStatus({ status }))
        )
    );

    phoneVerificationCompleted$ = createEffect(() =>
        this._actions.pipe(
            ofType(setPhoneVerificationRequestCodeStatus),
            map((action) => action.status),
            filter((status) => status === 'success'),
            map((_) => setSecurityCodeVerificationCompleted())
        )
    );

    requestLimitExceededEffect$ = createEffect(() =>
        this._actions.pipe(
            ofType(setPhoneVerificationRequestCodeStatus),
            filter((action) => action.status === RequestVerifyByPhoneStatus.limitExceeded),
            map((_) => setPhoneVerificationRequestCodeLimitExceeded())
        )
    );

    requestPhoneVerificationComplete$ = createEffect(() => this._actions.pipe(ofType(setPhoneVerificationRequestCodeStatus), map(phoneVerificationComplete)));
}
