import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { LoadAccountSubscriptionFromCredentialsRecoveryWorkflowRequest } from '@de-care/domains/identity/state-credentials-recovery';
import { catchError, tap } from 'rxjs/operators';
import { setAccountsData, setMaskedEmailIdForEmailConfirmation } from '../state/actions';
import { RecoverPasswordFromEmailWorkflowRequest, RecoverPasswordFromEmailWorkflowService } from '@de-care/domains/account/state-account';

@Injectable({ providedIn: 'root' })
export class IDMUserLookupWorkflowService implements DataWorkflow<LoadAccountSubscriptionFromCredentialsRecoveryWorkflowRequest, boolean> {
    constructor(private readonly _recoverPasswordFromEmailWorkflowService: RecoverPasswordFromEmailWorkflowService, private readonly _store: Store) {}

    build(request): Observable<any> {
        const param = {
            accountLoginCredentials: false,
            prospectUser: true,
            setResetKey: true,
            sxmUsername: request?.emailOrUsername,
            langPref: request?.langPref,
        };
        return this._recoverPasswordFromEmailWorkflowService.build(param).pipe(
            tap((response) => {
                if (response) {
                    this._store.dispatch(setMaskedEmailIdForEmailConfirmation({ maskedEmailId: param.sxmUsername }));
                }
            }),
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
