import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DataAccountService } from '../data-services/data-account.service';
import { RegisterDataModel, RegisterResponseDataModel } from '../data-services/registration.interface';
import { behaviorEventReactionForSuccessfulRegistration, behaviorEventReactionForFailedRegistration } from '@de-care/shared/state-behavior-events';
import { catchError, tap } from 'rxjs/operators';

export type RegisterWorkflowServiceError = 'USERNAME_ERROR' | 'PASSWORD_HAS_PII_DATA' | 'INVALID_PASSWORD' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class RegisterWorkflowService implements DataWorkflow<{ registrationData: RegisterDataModel }, RegisterResponseDataModel> {
    constructor(private _dataAccountService: DataAccountService, private readonly _store: Store) {}

    build({ registrationData }): Observable<RegisterResponseDataModel> {
        return this._dataAccountService.registerAccount(registrationData).pipe(
            tap((response) =>
                response.status === 'SUCCESS'
                    ? this._store.dispatch(behaviorEventReactionForSuccessfulRegistration())
                    : this._store.dispatch(behaviorEventReactionForFailedRegistration())
            ),
            catchError((error) => {
                this._store.dispatch(behaviorEventReactionForFailedRegistration());
                if (error.fieldErrors && (error.fieldErrors[0].errorCode === 'USER_NAME_ALREADY_IN_IDM' || error.fieldErrors[0].errorCode === 'USER_NAME_ALREADY_EXIST')) {
                    throw 'USERNAME_ERROR' as RegisterWorkflowServiceError;
                } else if (error.fieldErrors && error.fieldErrors[0].errorCode === 'PASSWORD_HAS_PII_DATA') {
                    throw 'PASSWORD_HAS_PII_DATA' as RegisterWorkflowServiceError;
                } else if (error.fieldErrors && error.fieldErrors[0].errorCode === 'INVALID_PASSWORD') {
                    throw 'INVALID_PASSWORD' as RegisterWorkflowServiceError;
                }
                throw 'SYSTEM' as RegisterWorkflowServiceError;
            })
        );
    }
}
