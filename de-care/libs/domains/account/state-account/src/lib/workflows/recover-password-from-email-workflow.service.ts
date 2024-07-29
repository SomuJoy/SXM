import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RecoverPasswordFromEmailService } from '../data-services/recover-password-from-email.service';

export interface RecoverPasswordFromEmailWorkflowRequest {
    sxmUsername?: any;
    accountLoginCredentials?: boolean;
    setResetKey?: boolean;
    subscriptionId?: number;
    prospectUser?: boolean;
    queryParam?: string;
    langPref?: string;
}

@Injectable({ providedIn: 'root' })
export class RecoverPasswordFromEmailWorkflowService implements DataWorkflow<RecoverPasswordFromEmailWorkflowRequest, boolean> {
    constructor(private readonly _recoverPasswordFromEmailService: RecoverPasswordFromEmailService) {}

    build(request: RecoverPasswordFromEmailWorkflowRequest): Observable<any> {
        return this._recoverPasswordFromEmailService.getAccount(request).pipe(
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
