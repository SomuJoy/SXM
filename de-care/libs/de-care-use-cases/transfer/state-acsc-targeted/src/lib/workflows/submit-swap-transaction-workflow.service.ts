import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store, select } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { CompleteSwapWorkflowService } from '@de-care/domains/purchase/state-service-continuity';
import { getSwapTransactionData } from '../state/selectors/public.selectors';
import { setSubmitTransactionAsProcessing, setSubmitTransactionAsNotProcessing, newTransactionIdDueToCreditCardError } from '../state/actions';
import { take, tap, mergeMap, catchError, map } from 'rxjs/operators';
import { behaviorEventReactionSwapFailure, behaviorEventReactionSwapSuccess } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class SubmitSwapTransactionWorkflowService implements DataWorkflow<null, boolean> {
    constructor(private readonly _store: Store, private readonly _completeSwapWorkflowService: CompleteSwapWorkflowService) {}

    build(): Observable<boolean> {
        return this._store.pipe(
            select(getSwapTransactionData),
            take(1),
            tap(() => this._store.dispatch(setSubmitTransactionAsProcessing())),
            mergeMap((swapData) => {
                return this._completeSwapWorkflowService.build(swapData).pipe(
                    map((response) => !!response),
                    tap(() => {
                        this._store.dispatch(setSubmitTransactionAsNotProcessing());
                        this._store.dispatch(behaviorEventReactionSwapSuccess());
                    }),
                    catchError((error) => {
                        if (error === 'CREDIT_CARD_FAILURE') {
                            this._store.dispatch(newTransactionIdDueToCreditCardError());
                        }
                        this._store.dispatch(setSubmitTransactionAsNotProcessing());
                        const errorCode = error?.error?.error?.errorCode ?? error;
                        this._store.dispatch(behaviorEventReactionSwapFailure({ errorMessage: errorCode }));
                        return throwError(error);
                    })
                );
            })
        );
    }
}
