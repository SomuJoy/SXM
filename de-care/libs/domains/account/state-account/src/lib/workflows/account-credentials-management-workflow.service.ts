import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, mapTo, tap } from 'rxjs/operators';
import { DataAccountNonPiiService } from '../data-services/data-account-non-pii.service';
import { RegisterVerifyOptionsService } from '../data-services/register-verify-options.service';

export interface AccountCredentialsManagementWorkflowRequest {
    accountNumber: string;
}

@Injectable({ providedIn: 'root' })
export class AccountCredentialsManagementWorkflowService implements DataWorkflow<AccountCredentialsManagementWorkflowRequest, boolean> {
    constructor(
        private readonly _dataAccountNonPiiService: DataAccountNonPiiService,
        private readonly _registerVerifyOptionsService: RegisterVerifyOptionsService,
        private readonly _store: Store
    ) {}

    build(request: AccountCredentialsManagementWorkflowRequest): Observable<boolean> {
        return this._dataAccountNonPiiService.getAccount(request).pipe(
            concatMap((nonPiiResponse) => this._registerVerifyOptionsService.getVerifyOptions(request).pipe(mapTo(nonPiiResponse))),
            mapTo(true),
            catchError((error) => {
                return throwError(error);
            })
        );
    }
}
