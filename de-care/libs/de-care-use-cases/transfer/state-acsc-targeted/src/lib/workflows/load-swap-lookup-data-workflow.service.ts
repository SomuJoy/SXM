import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store, select } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, mapTo, map, withLatestFrom } from 'rxjs/operators';
import { setSelectedSelfPaySubscriptionIdFromOAC, setIsLoggedIn, setTransactionId } from '../state/actions';
import { LoadAccountWorkflowService } from '@de-care/domains/account/state-account';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import * as uuid from 'uuid/v4';
import { behaviorEventReactionForTransactionId, behaviorEventErrorFromHttpCall, behaviorEventErrorFromBusinessLogic } from '@de-care/shared/state-behavior-events';
import { getIsAccountAddressInQuebec, getSubscriptionBySubscriptionIdFromOac } from '../state/selectors/state.selectors';
import { provinceChanged } from '@de-care/domains/customer/state-locale';

export type LoadSwapLookupDataWorkflowServiceError = 'USER_NOT_LOGGED_IN' | 'MISSING_SUBSCRIPTION_ID' | 'NO_MATCHING_SUBSCRIPTION_ID' | 'NETWORK_ERROR';

@Injectable({ providedIn: 'root' })
export class LoadSwapLookupDataWorkflowService implements DataWorkflow<{ subscriptionId: string }, boolean> {
    constructor(private readonly _store: Store, private readonly _loadAccountWorkflowService: LoadAccountWorkflowService) {}

    build({ subscriptionId }): Observable<boolean> {
        return this._loadAccountWorkflowService.build({}).pipe(
            map(() => {
                if (subscriptionId) {
                    this._store.dispatch(setSelectedSelfPaySubscriptionIdFromOAC({ subscriptionId }));
                } else {
                    throw new Error('MISSING_SUBSCRIPTION_ID');
                }
            }),
            withLatestFrom(this._store.pipe(select(getSubscriptionBySubscriptionIdFromOac))),
            map(([, matchingSubscription]) => {
                if (!matchingSubscription) {
                    throw new Error('NO_MATCHING_SUBSCRIPTION_ID');
                }
            }),
            withLatestFrom(this._store.pipe(select(getIsAccountAddressInQuebec))),
            tap(([, isAccountAddressInQuebec]) => {
                if (isAccountAddressInQuebec) {
                    this._store.dispatch(provinceChanged({ province: 'QC' }));
                }
                this._store.dispatch(setIsLoggedIn());
                this._store.dispatch(pageDataFinishedLoading());

                const transactionId = `OAC-${uuid()}`;
                this._store.dispatch(setTransactionId({ transactionId }));
                this._store.dispatch(behaviorEventReactionForTransactionId({ transactionId: transactionId }));
            }),

            mapTo(true),
            catchError((error) => {
                let errorMsg: LoadSwapLookupDataWorkflowServiceError;
                const errorCode = error?.error?.error?.errorCode ?? '';
                if (error?.status === 401 && errorCode) {
                    switch (errorCode) {
                        case 'UNAUTHENTICATED_CUSTOMER':
                            errorMsg = 'USER_NOT_LOGGED_IN';
                            break;
                        default:
                            errorMsg = 'NETWORK_ERROR';
                    }
                    this._store.dispatch(behaviorEventErrorFromHttpCall({ error }));
                } else if (error.message) {
                    errorMsg = error.message;
                    this._store.dispatch(behaviorEventErrorFromBusinessLogic({ message: errorMsg }));
                } else {
                    errorMsg = 'NETWORK_ERROR';
                    this._store.dispatch(behaviorEventErrorFromHttpCall({ error }));
                }
                return throwError(errorMsg);
            })
        );
    }
}
