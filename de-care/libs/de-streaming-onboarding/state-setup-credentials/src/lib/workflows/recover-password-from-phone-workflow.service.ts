import { Injectable } from '@angular/core';
import { RecoverPasswordFromPhoneWorkflowRequest, RecoverPasswordFromPhoneWorkflowService } from '@de-care/domains/account/state-account';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecoverPasswordFromPhoneLookupWorkflowService implements DataWorkflow<RecoverPasswordFromPhoneWorkflowRequest, boolean> {
    constructor(private readonly _recoverPasswordFromPhoneWorkflowService: RecoverPasswordFromPhoneWorkflowService, private readonly _store: Store) {}

    build(request: RecoverPasswordFromPhoneWorkflowRequest): Observable<any> {
        return this._recoverPasswordFromPhoneWorkflowService.build(request).pipe(
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
