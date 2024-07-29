import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { UpdateStreamingCredentialsWorkflowService } from '@de-care/domains/account/state-account';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { collectUpdateStreamingData, setInvalidEmailErrorForCredentialSetup, setInvalidFirstNameErrorForCredentialSetup } from '../state/actions';

export interface UpdateCredentialsWorkflowRequest {
    radioId: string;
    username: string;
    password: string;
    email: string;
    synchronizeAccountEmail: boolean;
}

@Injectable({ providedIn: 'root' })
export class UpdateCredentialsWorkflowService implements DataWorkflow<UpdateCredentialsWorkflowRequest, boolean> {
    constructor(private readonly _updateStreamingCredentialsWorkflowService: UpdateStreamingCredentialsWorkflowService, private readonly _store: Store) {}

    build(request: UpdateCredentialsWorkflowRequest): Observable<boolean> {
        return this._updateStreamingCredentialsWorkflowService.build(request).pipe(
            tap(() => {
                this._store.dispatch(collectUpdateStreamingData({ updateSXIRData: request }));
            }),
            catchError((error) => {
                const errorResponse = error.error.error;
                if (errorResponse?.fieldErrors) {
                    if (errorResponse.fieldErrors[0].errorCode === 'INVALID_EMAIL_ADDRESS') {
                        this._store.dispatch(setInvalidEmailErrorForCredentialSetup({ isInvalidEmailError: true }));
                    }
                    if (errorResponse.fieldErrors[0].errorCode === 'INVALID_FIRST_NAME') {
                        this._store.dispatch(setInvalidFirstNameErrorForCredentialSetup({ isInvalidFirstNameError: true }));
                    }
                }
                return throwError(error);
            })
        );
    }
}
