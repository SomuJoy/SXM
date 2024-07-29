import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RecoverUsernameFromEmailService } from '../data-services/recover-username-from-email.service';

export interface RecoverUsernameFromEmailWorkflowRequest {
    accountLoginCredentials?: boolean;
    email?: any;
    prospectUser?: boolean;
    subscriptionId?: number;
}

@Injectable({ providedIn: 'root' })
export class RecoverUsernameFromEmailWorkflowService implements DataWorkflow<RecoverUsernameFromEmailWorkflowRequest, boolean> {
    constructor(private readonly _recoverUserNameFromEmailService: RecoverUsernameFromEmailService) {}

    build(request: RecoverUsernameFromEmailWorkflowRequest): Observable<any> {
        return this._recoverUserNameFromEmailService.getAccount(request).pipe(
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
