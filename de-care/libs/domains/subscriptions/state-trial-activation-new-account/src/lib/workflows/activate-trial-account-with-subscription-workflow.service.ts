import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivateTrialAccountRequest } from '../data-services/activate-trial-account-request.interfaces';
import { ActivateTrialAccountResponse } from '../data-services/activate-trial-account-response.interfaces';
import { DataActivateTrialAccountService } from '../data-services/data-activate-trial-account.service';
import { activateTrialAccountError } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class ActivateTrialAccountWithSubscriptionWorkflowService implements DataWorkflow<ActivateTrialAccountRequest, ActivateTrialAccountResponse> {
    constructor(private readonly _store: Store, private readonly _dataActivateTrialAccountService: DataActivateTrialAccountService) {}

    build(request: ActivateTrialAccountRequest): Observable<ActivateTrialAccountResponse> {
        return this._dataActivateTrialAccountService.activateTrialAccount(request).pipe(
            catchError(error => {
                this._store.dispatch(activateTrialAccountError({ error }));
                return throwError(error);
            })
        );
    }
}
