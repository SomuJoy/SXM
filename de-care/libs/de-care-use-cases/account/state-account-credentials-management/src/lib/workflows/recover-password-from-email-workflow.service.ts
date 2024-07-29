import { Injectable } from '@angular/core';
import { RecoverPasswordFromEmailWorkflowService } from '@de-care/domains/account/state-account';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface RecoverPasswordFromEmailWorkflowRequest {
    sxmUsername?: any;
    accountLoginCredentials?: any;
    setResetKey?: any;
    subscriptionId?: any;
    prospectUser?: any;
    queryParam?: string;
    langPref?: string;
}

@Injectable({ providedIn: 'root' })
export class RecoverPasswordFromEmailWorkflowServices implements DataWorkflow<RecoverPasswordFromEmailWorkflowRequest, boolean> {
    constructor(private readonly _recoverPasswordFromEmailService: RecoverPasswordFromEmailWorkflowService) {}

    build(request: RecoverPasswordFromEmailWorkflowRequest): Observable<any> {
        return this._recoverPasswordFromEmailService.build(request).pipe(
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
