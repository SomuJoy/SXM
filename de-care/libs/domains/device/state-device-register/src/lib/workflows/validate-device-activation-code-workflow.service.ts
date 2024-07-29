import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Data10FootDeviceValidateCodeService } from '../data-services/data-10-foot-device-validate-code.service';
import { behaviorEventErrorFromBusinessLogic, behaviorEventErrorFromSystem, behaviorEventReaction10FootDeviceInfo } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class ValidateDeviceActivationCodeWorkflowService implements DataWorkflow<{ activationCode: string }, boolean> {
    constructor(private readonly _store: Store, private readonly _data10FootDeviceValidateCodeService: Data10FootDeviceValidateCodeService) {}

    build(request: { activationCode: string }): Observable<boolean> {
        return this._data10FootDeviceValidateCodeService.validate(request).pipe(
            map((response) => {
                this._store.dispatch(behaviorEventReaction10FootDeviceInfo({ deviceInfo: response?.deviceType }));
                return response.status === 'SUCCESS';
            }),
            tap(() => {
                // TODO: add logic here to dispatch behavior
            }),
            catchError((error) => {
                let errorType: 'SYSTEM' | 'INVALID_ACTIVATION_CODE' = 'SYSTEM';
                if (['INVALID_CHANNEL_LINEUP_ID', 'LDAP_FAILURE'].includes(error.errorCode)) {
                    errorType = 'INVALID_ACTIVATION_CODE';
                    this._store.dispatch(
                        behaviorEventErrorFromBusinessLogic({
                            message: 'Your security code is either incorrect or has expired.',
                            errorCode: errorType,
                        })
                    );
                } else if (Array.isArray(error.fieldErrors) && error.fieldErrors.length > 0) {
                    if (
                        [
                            'INVALID_REGION',
                            'INVALID_DEVICE_ID',
                            'ACCOUNT_IS_INACTIVE',
                            'SUBSCRIBER_ACCOUNT_IS_CLOSED',
                            'PROSPECT_ACCOUNT_IS_EXPIRED',
                            'AUTHENTICATION_FAILED',
                            'INVALID_PASSCODE',
                            'PASSCODE_EXPIRED',
                            'INVALID_DEVICE_TYPE',
                            'GRANDFATHER_ACCOUNT_CANNOT_ACCESS',
                            'TOKEN_VAILDATION_FAILED',
                            'INVALID_TOKEN',
                            'INVALID_ACTIVATION_CODE',
                        ].includes(error.fieldErrors[0].errorCode)
                    ) {
                        errorType = 'INVALID_ACTIVATION_CODE';
                        this._store.dispatch(
                            behaviorEventErrorFromBusinessLogic({
                                message: 'Your security code is either incorrect or has expired.',
                                errorCode: errorType,
                            })
                        );
                    }
                } else if (errorType === 'SYSTEM') {
                    this._store.dispatch(
                        behaviorEventErrorFromSystem({
                            message: 'We’re sorry… something went wrong. We’re experiencing technical issues and are working on resolving it. Please try again.',
                            errorCode: errorType,
                        })
                    );
                }

                return throwError(errorType);
            })
        );
    }
}
