import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { concatMap, take, tap, catchError } from 'rxjs/operators';
import { getChangeSubscriptionSubmitData } from '../state/selectors/review-order.selectors';
import { ChangeSubscriptionWorkflowService } from '@de-care/domains/purchase/state-change-subscription';
import {
    setSubmitChangeSubscriptionDataAsProcessing,
    setSubmitChangeSubscriptionDataAsNotProcessing,
    newTransactionIdDueToFailureToCompleteProcess,
    setIsRefreshAllowed,
} from '../state/actions';

@Injectable({ providedIn: 'root' })
export class SubmitChangeSubscriptionWorkflowService implements DataWorkflow<void, void> {
    constructor(private readonly _store: Store, private readonly _changeSubscriptionWorkflowService: ChangeSubscriptionWorkflowService) {}

    build(): Observable<any> {
        return this._store.pipe(
            select(getChangeSubscriptionSubmitData),
            take(1),
            tap(() => this._store.dispatch(setSubmitChangeSubscriptionDataAsProcessing())),
            concatMap((data) =>
                this._changeSubscriptionWorkflowService.build(data).pipe(
                    tap((response) => this._store.dispatch(setIsRefreshAllowed({ isRefreshAllowed: response.isRefreshAllowed }))),
                    tap(() => this._store.dispatch(setSubmitChangeSubscriptionDataAsNotProcessing())),
                    catchError((error) => {
                        this._store.dispatch(newTransactionIdDueToFailureToCompleteProcess());
                        this._store.dispatch(setSubmitChangeSubscriptionDataAsNotProcessing());
                        return throwError(error);
                    })
                )
            )
        );
    }
}
