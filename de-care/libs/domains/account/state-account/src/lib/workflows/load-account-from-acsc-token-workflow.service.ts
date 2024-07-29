import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { AccountFromAcscTokenModel } from '../data-services/account-from-token.interface';
import { Observable, throwError } from 'rxjs';
import { DataAccountAcscTokenService } from '../data-services/data-account-acsc-token.service';
import { Store } from '@ngrx/store';
import { catchError, tap } from 'rxjs/operators';
import { loadAccountError, setSCEligibleClosedDevices, setSCEligibleSubscriptions, setSPEligibleClosedRadioIds, setSPEligibleSelfPaySubscriptionIds } from '../state/actions';
import { behaviorEventReactionAccountFromAcscTokenFailure, behaviorEventReactionAccountFromAcscTokenSuccess } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class LoadAccountFromAcscTokenWorkflowService implements DataWorkflow<{ token: string }, AccountFromAcscTokenModel> {
    constructor(private _dataAccountAcscTokenService: DataAccountAcscTokenService, private _store: Store) {}
    build({ token }): Observable<AccountFromAcscTokenModel> {
        return this._dataAccountAcscTokenService.getAccountFromToken(token).pipe(
            tap((response) => {
                this._store.dispatch(setSCEligibleSubscriptions({ sCEligibleSubscriptions: response.sCEligibleSelfPaySubscriptions }));
                this._store.dispatch(setSCEligibleClosedDevices({ sCEligibleClosedDevices: response.sCEligibleClosedDevices }));
                this._store.dispatch(setSPEligibleSelfPaySubscriptionIds({ sPEligibleSelfPaySubscriptionIds: response.sPEligibleSelfPaySubscriptionIds }));
                this._store.dispatch(setSPEligibleClosedRadioIds({ sPEligibleClosedRadioIds: response.sPEligibleClosedRadioIds }));
                this._store.dispatch(behaviorEventReactionAccountFromAcscTokenSuccess());
            }),
            catchError((error) => {
                this._store.dispatch(loadAccountError({ error }));
                const errorCode = error?.error?.error?.errorCode ?? '';
                this._store.dispatch(behaviorEventReactionAccountFromAcscTokenFailure({ errorMessage: errorCode }));
                return throwError(error);
            })
        );
    }
}
