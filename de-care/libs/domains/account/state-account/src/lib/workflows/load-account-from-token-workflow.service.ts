import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { AccountFromTokenModel } from '../data-services/account-from-token.interface';
import { Observable, throwError } from 'rxjs';
import { DataAccountTokenService } from '../data-services/data-account-token.service';
import { Store } from '@ngrx/store';
import { catchError, tap } from 'rxjs/operators';
import { loadAccountError, setAccount } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class LoadAccountFromTokenWorkflowService
    implements DataWorkflow<{ token: string; student: boolean; isStreaming; allowErrorHandler: boolean; tokenType: string }, AccountFromTokenModel>
{
    constructor(private _dataAccountTokenService: DataAccountTokenService, private _store: Store) {}

    build({ token, isStreaming, student, allowErrorHandler = true, tokenType }): Observable<AccountFromTokenModel> {
        return this._dataAccountTokenService.getAccountFromToken(token, isStreaming, student, allowErrorHandler, tokenType).pipe(
            tap((response) => this._store.dispatch(setAccount({ account: response.nonPIIAccount }))),
            catchError((error) => {
                this._store.dispatch(loadAccountError({ error }));
                return throwError(error);
            })
        );
    }
}
