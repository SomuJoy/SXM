import { Injectable } from '@angular/core';
import {
    behaviorEventReactionStreamingFlepzLookupFailure,
    behaviorEventReactionStreamingFlepzLookupReturnedMultipleAccounts,
    behaviorEventReactionStreamingFlepzLookupReturnedNoAccounts,
    behaviorEventReactionStreamingFlepzLookupReturnedSingleAccount,
    behaviorEventReactionStreamingFlepzLookupSuccess
} from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { StreamingFlepzRequest, StreamingFlepzService } from '../data-services/streaming-flepz.service';
import { clearStreamingFlepzLookupAccounts, setStreamingFlepzLookupAccounts } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class StreamingFlepzLookupWorkflowService implements DataWorkflow<StreamingFlepzRequest, boolean> {
    constructor(private readonly _streamingFlepzService: StreamingFlepzService, private readonly _store: Store) {}

    static _mapSubscriptions(subscriptions) {
        return subscriptions.map(({ eligibleService, eligibilityType, inEligibleReasonCode, radioService, plans }) => ({
            eligibleService,
            eligibilityType,
            inEligibleReasonCode,
            last4DigitsOfRadioId: radioService?.last4DigitsOfRadioId,
            type: plans?.[0]?.type
        }));
    }

    build(request: StreamingFlepzRequest): Observable<boolean> {
        return this._streamingFlepzService.customerFlepz(request).pipe(
            tap(accounts => {
                this._store.dispatch(behaviorEventReactionStreamingFlepzLookupSuccess());
                if (Array.isArray(accounts) && accounts.length > 0) {
                    if (accounts.length === 1) {
                        this._store.dispatch(
                            behaviorEventReactionStreamingFlepzLookupReturnedSingleAccount({
                                subscriptions: StreamingFlepzLookupWorkflowService._mapSubscriptions(accounts[0].subscriptions)
                            })
                        );
                    } else {
                        this._store.dispatch(
                            behaviorEventReactionStreamingFlepzLookupReturnedMultipleAccounts({
                                subscriptions: accounts.reduce((subs, { subscriptions }) => {
                                    return [...subs, ...StreamingFlepzLookupWorkflowService._mapSubscriptions(subscriptions)];
                                }, [])
                            })
                        );
                    }
                    this._store.dispatch(setStreamingFlepzLookupAccounts({ accounts }));
                } else {
                    this._store.dispatch(behaviorEventReactionStreamingFlepzLookupReturnedNoAccounts());
                    this._store.dispatch(clearStreamingFlepzLookupAccounts());
                }
            }),
            catchError(error => {
                this._store.dispatch(behaviorEventReactionStreamingFlepzLookupFailure({ error: error?.error }));
                this._store.dispatch(clearStreamingFlepzLookupAccounts());
                return throwError(error);
            }),
            mapTo(true)
        );
    }
}
