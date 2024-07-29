import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { LoadAccountSubscriptionFromCredentialsRecoveryWorkflowRequest } from '@de-care/domains/identity/state-credentials-recovery';
import { catchError, tap } from 'rxjs/operators';
import { setMaskedEmailIdForEmailConfirmation } from '../state/actions';
import { RecoverUsernameFromEmailWorkflowService } from '@de-care/domains/account/state-account';

@Injectable({ providedIn: 'root' })
export class IDMUserNameLookupWorkflowService implements DataWorkflow<LoadAccountSubscriptionFromCredentialsRecoveryWorkflowRequest, boolean> {
    constructor(private readonly _recoverUsernameFromEmailWorkflowService: RecoverUsernameFromEmailWorkflowService, private readonly _store: Store) {}

    build(request): Observable<any> {
        const param = {
            accountLoginCredentials: false,
            prospectUser: true,
            email: request?.emailOrUsername,
        };
        return this._recoverUsernameFromEmailWorkflowService.build(param).pipe(
            tap((response) => {
                if (response) {
                    this._store.dispatch(setMaskedEmailIdForEmailConfirmation({ maskedEmailId: param.email }));
                }
            }),
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
