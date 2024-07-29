import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { ValidateDeviceWorkflowService } from '@de-care/domains/device/state-device-validate';
import { LoadAccountFromAccountDataWorkflow } from '@de-care/domains/account/state-account';
import { catchError, concatMap } from 'rxjs/operators';

interface ValidateRadioIdAndLoadAccountWorkflowServiceRequest {
    radioId: string;
    accountNumber?: string;
    lastName?: string;
}

export type ValidateRadioIdAndLoadAccountWorkflowServiceErrors = 'INVALID_RADIO_ID' | 'RADIO_ID_NOT_FOUND' | 'LOOKUP_FAILED' | 'LPZ_VALIDATION_REQUIRED' | 'SYSTEM_ERROR';

@Injectable({ providedIn: 'root' })
export class ValidateRadioIdAndLoadAccountWorkflowService implements DataWorkflow<ValidateRadioIdAndLoadAccountWorkflowServiceRequest, boolean> {
    constructor(
        private readonly _validateDeviceWorkflowService: ValidateDeviceWorkflowService,
        private readonly _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow
    ) {}

    build(request: ValidateRadioIdAndLoadAccountWorkflowServiceRequest): Observable<boolean> {
        const validateDevice$ = this._validateDeviceWorkflowService.build({ radioId: request.radioId }).pipe(
            catchError(() => {
                // TODO: handle different error types from validate device call and map to appropriate error type here
                return throwError('INVALID_RADIO_ID' as ValidateRadioIdAndLoadAccountWorkflowServiceErrors);
            })
        );
        return validateDevice$.pipe(
            concatMap(() =>
                this._loadAccountFromAccountDataWorkflow.build({ ...request }).pipe(
                    catchError((error) => {
                        const fieldError = error?.fieldErrors ? error?.fieldErrors[0] : error?.error?.error;
                        if (fieldError.fieldName === 'radioId') {
                            return throwError('LOOKUP_FAILED' as ValidateRadioIdAndLoadAccountWorkflowServiceErrors);
                        }
                        switch (fieldError.errorCode) {
                            case 'ACCOUNT_NUMBER_MISMATCH':
                                return throwError('LPZ_VALIDATION_REQUIRED' as ValidateRadioIdAndLoadAccountWorkflowServiceErrors);
                            case 'DATA_NOT_FOUND':
                                return throwError('LOOKUP_FAILED' as ValidateRadioIdAndLoadAccountWorkflowServiceErrors);
                            default:
                                return throwError('SYSTEM_ERROR' as ValidateRadioIdAndLoadAccountWorkflowServiceErrors);
                        }
                    })
                )
            )
        );
    }
}
