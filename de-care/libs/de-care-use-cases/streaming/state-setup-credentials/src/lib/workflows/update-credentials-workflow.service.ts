import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { getCredentialSetupUsernameShouldBeReadonly } from '../state/public.selectors';
import { take, concatMap, map, catchError } from 'rxjs/operators';
import { UpdateStreamingCredentialsWorkflowService } from '@de-care/domains/account/state-account';
import { setInvalidEmailErrorForCredentialSetup, setInvalidFirstNameErrorForCredentialSetup } from '../state/actions';

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
        return this._store.select(getCredentialSetupUsernameShouldBeReadonly).pipe(
            take(1),
            map((usernameShouldBeReadonly) => {
                if (usernameShouldBeReadonly) {
                    return {
                        radioId: request.radioId,
                        password: request.password,
                        email: request.email,
                    };
                } else {
                    return request;
                }
            }),
            concatMap((credentialData) => this._updateStreamingCredentialsWorkflowService.build(credentialData)),
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
