import { Injectable } from '@angular/core';
import { RecoverUsernameFromEmailWorkflowService, RegisterAccountNonPiiWorkflowService } from '@de-care/domains/account/state-account';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecoverUserNameFromEmailWorkflowService implements DataWorkflow<{ identifierToLookupWith: string }, any> {
    constructor(
        private readonly _registerAccountNonPiiWorkflowService: RegisterAccountNonPiiWorkflowService,
        private readonly _recoverUsernameFromEmailWorkflowService: RecoverUsernameFromEmailWorkflowService
    ) {}

    build(request): Observable<any> {
        const param = {
            subscriptionId: request.subscriptionId,
            accountLoginCredentials: request.accountLoginCredentials,
            prospectUser: request.prospectUser,
        };
        return this._registerAccountNonPiiWorkflowService.build({ accountNumber: request.accountNumber }).pipe(
            concatMap(() => this._recoverUsernameFromEmailWorkflowService.build(param)),
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
