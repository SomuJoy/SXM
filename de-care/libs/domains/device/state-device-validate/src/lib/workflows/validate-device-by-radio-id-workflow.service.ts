import { Injectable } from '@angular/core';
import { behaviorEventErrorFromBusinessLogic } from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DeviceValidateService, RadioModel } from '../data-services/device-validate.service';

@Injectable({ providedIn: 'root' })
export class ValidateDeviceByRadioIdWorkflowService implements DataWorkflow<string, RadioModel> {
    constructor(private readonly _deviceValidateService: DeviceValidateService, private readonly _store: Store) {}

    build(radioId: string): Observable<RadioModel> {
        return this._deviceValidateService.validate({ radioId }, false).pipe(
            catchError(error => {
                if (error.status === 400) {
                    const responseError = error?.error?.error;
                    responseError?.fieldErrors.forEach(fieldError => {
                        if (fieldError?.errorCode === 'INVALID_MISSING_VIN' && fieldError?.fieldName.toLowerCase() === 'radioid') {
                            this._store.dispatch(behaviorEventErrorFromBusinessLogic({ message: 'No radio match found', errorCode: fieldError?.errorCode }));
                        }
                    });
                }
                return throwError(error);
            })
        );
    }
}
