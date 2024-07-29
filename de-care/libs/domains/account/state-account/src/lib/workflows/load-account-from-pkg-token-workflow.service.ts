import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { throwError } from 'rxjs';
import { DataAccountPKGTokenService } from '../data-services/data-account-pkg-token.service';
import { Store } from '@ngrx/store';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { loadAccountError, setAccount, setSecondarySubscriptions } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class LoadAccountFromPKGTokenWorkflowService implements DataWorkflow<{ token: string; student: boolean; isStreaming; allowErrorHandler: boolean }, boolean> {
    constructor(private _dataAccountPKGTokenService: DataAccountPKGTokenService, private _store: Store) {}

    build({ token, isStreaming = false, student = false, allowErrorHandler = true }) {
        return this._dataAccountPKGTokenService.getAccountFromToken(token, isStreaming, student, allowErrorHandler).pipe(
            tap((response) => {
                this._store.dispatch(setAccount({ account: response.nonPIIAccount }));
            }),
            mapTo(true),
            catchError((error) => {
                this._store.dispatch(loadAccountError({ error }));
                return throwError(error);
            })
        );
    }
}
