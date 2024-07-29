import { Injectable } from '@angular/core';
import { AccountCredentialsManagementWorkflowService } from '@de-care/domains/account/state-account';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UpdateAccountCredentialsManagementWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store, private readonly _accountCredentialsManagementWorkflowService: AccountCredentialsManagementWorkflowService) {}

    build(request): Observable<boolean> {
        return this._accountCredentialsManagementWorkflowService.build(request).pipe(
            map((response) => response),
            catchError(() => of(false))
        );
    }
}
