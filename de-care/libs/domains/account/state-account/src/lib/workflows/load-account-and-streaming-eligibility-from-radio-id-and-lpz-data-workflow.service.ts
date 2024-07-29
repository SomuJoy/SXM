import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, tap, withLatestFrom } from 'rxjs/operators';
import { patchSubscriptionWithStreamingEligibilityById, resetAccountStateToInitial } from '../state/actions';
import { getAccountIsInPreTrial, getFirstAccountSubscriptionId, getClosedDevicesStatus } from '../state/selectors';
import { CheckIfRadioIsStreamingEligibleWorkflowService } from './check-if-radio-is-streaming-eligible-workflow.service';
import { LoadAccountFromAccountDataWorkflow } from './load-account-from-account-data-workflow.service';
import { VerifyAccountByLpzWorkflowService } from './verify-account-by-lpz-workflow.service';

interface WorkflowRequest {
    radioId: string;
    lastName: string;
    phoneNumber: string;
    zipCode: string;
    pvtTime: string;
}

@Injectable({ providedIn: 'root' })
export class LoadAccountAndStreamingEligibilityFromRadioIdAndLpzDataWorkflowService implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow,
        private readonly _checkIfRadioIsStreamingEligibleWorkflowService: CheckIfRadioIsStreamingEligibleWorkflowService,
        private readonly _verifyAccountByLpzWorkflowService: VerifyAccountByLpzWorkflowService
    ) {}

    build({ radioId, pvtTime, lastName, phoneNumber, zipCode }: WorkflowRequest): Observable<boolean> {
        return this._loadAccountFromAccountDataWorkflow.build({ pvtTime, radioId }).pipe(
            withLatestFrom(this._store.pipe(select(getAccountIsInPreTrial)), this._store.pipe(select(getClosedDevicesStatus))),
            concatMap(([, isInPreTrial, status]) => {
                if (status === 'closed' || status === 'inactive') {
                    return throwError('Radio not active');
                }
                return isInPreTrial
                    ? of(true)
                    : this._verifyLPZ({ lastName, phoneNumber, zipCode }).pipe(
                          concatMap(() => this._loadStreamingEligibility(radioId)),
                          mapTo(true)
                      );
            }),
            catchError((_) => throwError(_))
        );
    }

    private _verifyLPZ(lpzData: { lastName: string; phoneNumber: string; zipCode: string }): Observable<boolean> {
        return this._verifyAccountByLpzWorkflowService.build(lpzData).pipe(
            map((verified) => {
                if (!verified) {
                    this._clearAccountDataFromState();
                    throw {
                        error: {
                            error: {
                                fieldErrors: [{ errorType: 'BUSINESS' }],
                            },
                        },
                    };
                }
                return true;
            }),
            catchError((_) => throwError(_))
        );
    }

    private _loadStreamingEligibility(radioId: string): Observable<boolean> {
        return this._checkIfRadioIsStreamingEligibleWorkflowService.build({ radioId }).pipe(
            withLatestFrom(this._store.select(getFirstAccountSubscriptionId)),
            tap(([streamingEligibility, subscriptionId]) => {
                this._store.dispatch(patchSubscriptionWithStreamingEligibilityById({ subscriptionId, streamingEligibility }));
            }),
            mapTo(true)
        );
    }

    private _clearAccountDataFromState() {
        // When the radio is invalid or the lpz data is not a match we should clear out the account data we loaded into state
        this._store.dispatch(resetAccountStateToInitial());
    }
}
