import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { throwError } from 'rxjs';
import { DataAccountVIPTokenService } from '../data-services/data-account-vip-token.service';
import { Store } from '@ngrx/store';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { loadAccountError, setAccount, setIsTokenizedLink, setSecondaryStreamingSubscriptions, setSecondarySubscriptions } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class LoadAccountFromVIPTokenWorkflowService implements DataWorkflow<{ token: string; student: boolean; isStreaming; allowErrorHandler: boolean }, boolean> {
    constructor(private _dataAccountVIPTokenService: DataAccountVIPTokenService, private _store: Store) {}

    build({ token, isStreaming = false, student = false, allowErrorHandler = true }) {
        return this._dataAccountVIPTokenService.getAccountFromToken(token, isStreaming, student, allowErrorHandler).pipe(
            tap((response) => {
                this._store.dispatch(setIsTokenizedLink({ isTokenizedLink: true }));
                this._store.dispatch(setAccount({ account: response.nonPIIAccount }));
                this._store.dispatch(setSecondarySubscriptions({ secondarySubscriptions: response.eligibleSecondarySubscriptions }));
                this._store.dispatch(setSecondaryStreamingSubscriptions({ secondaryStreamingSubscriptions: response?.eligibleSecondaryStreamingSubscriptions }));
            }),
            mapTo(true),
            catchError((error) => {
                this._store.dispatch(loadAccountError({ error }));
                return throwError(error);
            })
        );
    }
}
