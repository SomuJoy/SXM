import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError, combineLatest } from 'rxjs';
import { catchError, concatMap, take, tap } from 'rxjs/operators';
import { getPaymentProcessRequest, getUpdatePaymentRequest, getIsUpdatePaymentMethodOnly } from '../state/public.selectors';
import { MakePaymentWorkflowService, UpdatePaymentWorkflowService } from '@de-care/domains/payment/state-make-payment';
import { newTransactionIdDueToCreditCardError, setPaymentProcessSuccessful, clearPaymentProcessSuccessful, setUpdatePaymentProcessSuccessFul } from '../state/actions';

export type ProcessPaymentWorkflowErrors = 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class ProcessPaymentWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _makePaymentWorkflowService: MakePaymentWorkflowService,
        private readonly _updatePaymentWorkflowService: UpdatePaymentWorkflowService
    ) {}

    build(): Observable<boolean> {
        return combineLatest([
            this._store.select(getIsUpdatePaymentMethodOnly),
            this._store.select(getPaymentProcessRequest),
            this._store.select(getUpdatePaymentRequest),
        ]).pipe(
            take(1),
            concatMap(([isOnlyUpdatingPayment, paymentProcessRequest, updatePaymentRequest]) => {
                const payment$ = isOnlyUpdatingPayment
                    ? this._updatePaymentWorkflowService.build(updatePaymentRequest).pipe(tap((resp) => resp && this._store.dispatch(setUpdatePaymentProcessSuccessFul())))
                    : this._makePaymentWorkflowService.build(paymentProcessRequest).pipe(tap((resp) => resp && this._store.dispatch(setPaymentProcessSuccessful())));
                return payment$.pipe(
                    catchError((error) => {
                        this._store.dispatch(clearPaymentProcessSuccessful());
                        this._store.dispatch(newTransactionIdDueToCreditCardError());
                        return throwError(error);
                    })
                );
            })
        );
    }
}
