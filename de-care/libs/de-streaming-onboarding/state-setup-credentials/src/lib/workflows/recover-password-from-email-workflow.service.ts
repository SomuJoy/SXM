import { Injectable } from '@angular/core';
import { RecoverPasswordFromEmailWorkflowRequest, RecoverPasswordFromEmailWorkflowService } from '@de-care/domains/account/state-account';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecoverPasswordFromEmailLookupWorkflowService implements DataWorkflow<RecoverPasswordFromEmailWorkflowRequest, boolean> {
    constructor(private readonly _recoverPasswordFromEmailWorkflowService: RecoverPasswordFromEmailWorkflowService, private readonly _store: Store) {}

    build(request: RecoverPasswordFromEmailWorkflowRequest): Observable<any> {
        return this._recoverPasswordFromEmailWorkflowService.build(request).pipe(
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
