import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { AccountFromTokenModel } from '../data-services/account-from-token.interface';
import { throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError, tap } from 'rxjs/operators';
import { loadAccountError, setAccount, setIsUserNameInTokenSameAsAccount, setMaskedUserNameFromToken } from '../state/actions';
import { AccountTokenWithTypeRequest, AccountTokenWithTypeService } from '../data-services/account-from-token-with-type.service';

@Injectable({ providedIn: 'root' })
export class LoadAccountFromTokenWithTypeWorkflowService implements DataWorkflow<AccountTokenWithTypeRequest, AccountFromTokenModel> {
    constructor(private _accountTokenWithTypeService: AccountTokenWithTypeService, private _store: Store) {}

    build(request) {
        return this._accountTokenWithTypeService.getAccountFromToken(request).pipe(
            tap((response) => {
                this._store.dispatch(setIsUserNameInTokenSameAsAccount({ isUserNameInTokenSameAsAccount: response.isUserNameInTokenSameAsAccount || false }));
                this._store.dispatch(setAccount({ account: response.nonPIIAccount }));
                this._store.dispatch(setMaskedUserNameFromToken({ maskedUserNameFromToken: response.maskedUserNameFromToken }));
            }),
            catchError((error) => {
                this._store.dispatch(loadAccountError({ error }));
                return throwError(error);
            })
        );
    }
}
