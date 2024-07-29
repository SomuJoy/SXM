import { Injectable } from '@angular/core';
import { behaviorEventErrorFromBusinessLogic, behaviorEventErrorFromSystem } from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Data10FootDeviceRegisterService } from '../data-services/data-10-foot-device-register.service';

interface WorkflowRequest {
    activationCode: string;
    username: string;
    password: string;
}

@Injectable({ providedIn: 'root' })
export class RegisterDeviceViaActivationCodeAndCredentialsWorkflowService implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(private readonly _store: Store, private readonly _data10FootDeviceRegisterService: Data10FootDeviceRegisterService) {}

    build(request: { activationCode: string; username: string; password: string }): Observable<boolean> {
        return this._data10FootDeviceRegisterService.register(request).pipe(
            map((response) => response.status === 'SUCCESS'),
            tap(() => {
                // TODO: add logic here to dispatch behavior
            }),
            catchError((error) => {
                let errorType: 'SYSTEM' | 'INVALID_ACTIVATION_CODE' | 'INVALID_CREDENTIALS' = 'SYSTEM';
                if (['INVALID_CHANNEL_LINEUP_ID'].includes(error.errorCode)) {
                    errorType = 'INVALID_ACTIVATION_CODE';
                    this._store.dispatch(
                        behaviorEventErrorFromBusinessLogic({
                            message: 'Your activation code has expired. Please go back and try again.',
                            errorCode: errorType,
                        })
                    );
                } else if (Array.isArray(error.fieldErrors) && error.fieldErrors.length > 0) {
                    if (
                        [
                            'INVALID_REGION',
                            'INVALID_DEVICE_ID',
                            'INVALID_PASSCODE',
                            'PASSCODE_EXPIRED',
                            'INVALID_DEVICE_TYPE',
                            'TOKEN_VAILDATION_FAILED',
                            'INVALID_TOKEN',
                            'INVALID_ACTIVATION_CODE',
                        ].includes(error.fieldErrors[0].errorCode)
                    ) {
                        errorType = 'INVALID_ACTIVATION_CODE';
                        this._store.dispatch(
                            behaviorEventErrorFromBusinessLogic({
                                message: 'Your activation code has expired. Please go back and try again.',
                                errorCode: errorType,
                            })
                        );
                    } else if (
                        [
                            'ACCOUNT_LOCKOUT_ERROR',
                            'INVALID_USERNAME_OR_PASSWORD',
                            'ACCOUNT_IS_INACTIVE',
                            'SUBSCRIBER_ACCOUNT_IS_CLOSED',
                            'PROSPECT_ACCOUNT_IS_EXPIRED',
                            'GRANDFATHER_ACCOUNT_CANNOT_ACCESS',
                            'INVALID_CREDENTIALS',
                        ].includes(error.fieldErrors[0].errorCode)
                    ) {
                        errorType = 'INVALID_CREDENTIALS';
                        this._store.dispatch(
                            behaviorEventErrorFromBusinessLogic({
                                message: 'We don’t recognize your username or password. Please try again.',
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
                } else {
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
