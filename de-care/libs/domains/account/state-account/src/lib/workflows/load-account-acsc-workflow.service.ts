import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { DataAccountAcscService, AccountAcscResponse, AcscRequest } from '../data-services/data-account-acsc.service';
import { Store } from '@ngrx/store';
import { catchError, tap } from 'rxjs/operators';
import { loadAccountError, setSCEligibleSubscriptions, setSCEligibleClosedDevices, setSPEligibleSelfPaySubscriptionIds, setSPEligibleClosedRadioIds } from '../state/actions';
import { behaviorEventReactionAccountAcscFailure, behaviorEventReactionAccountAcscSuccess } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class LoadAccountAcscWorkflowService implements DataWorkflow<AcscRequest, AccountAcscResponse> {
    constructor(private _dataAccountAcscService: DataAccountAcscService, private _store: Store) {}
    build(request: AcscRequest): Observable<AccountAcscResponse> {
        return this._dataAccountAcscService.getAccount(request).pipe(
            tap((response) => {
                this._store.dispatch(behaviorEventReactionAccountAcscSuccess());
                this._store.dispatch(setSCEligibleSubscriptions({ sCEligibleSubscriptions: response.sCEligibleSelfPaySubscriptions }));
                this._store.dispatch(setSCEligibleClosedDevices({ sCEligibleClosedDevices: response.sCEligibleClosedDevices }));
                this._store.dispatch(setSPEligibleSelfPaySubscriptionIds({ sPEligibleSelfPaySubscriptionIds: response.sPEligibleSelfPaySubscriptionIds }));
                this._store.dispatch(setSPEligibleClosedRadioIds({ sPEligibleClosedRadioIds: response.sPEligibleClosedRadioIds }));
            }),
            catchError((error) => {
                this._store.dispatch(loadAccountError({ error }));
                const errorCode = error?.error?.error?.errorCode ?? '';
                this._store.dispatch(behaviorEventReactionAccountAcscFailure({ errorMessage: errorCode }));
                return throwError(error);
            })
        );
    }
}
