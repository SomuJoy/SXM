import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AccountVerificationRequest, AccountVerificationStatus, VerifyAccountService } from '../data-services/verify-account.service';
import { setAccountVerificationStatus } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class SubmitVerifyAccountWorkflow implements DataWorkflow<AccountVerificationRequest, AccountVerificationStatus> {
    constructor(private readonly _store: Store, private readonly _verifyAccountService: VerifyAccountService) {}

    build(request: AccountVerificationRequest): Observable<AccountVerificationStatus> {
        return this._verifyAccountService
            .authenticationVerifyAccount(request)
            .pipe(tap(response => this._store.dispatch(setAccountVerificationStatus({ status: response.status, accountNumber: request?.accountNumber }))));
    }
}
