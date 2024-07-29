import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { behaviorEventErrorFromBusinessLogic } from '@de-care/shared/state-behavior-events';
import { DataUpdatePaymentService, CreditCardInfo, BillingAddressInfo } from '../data-services/data-update-payment.service';

interface UpdatePaymentServiceWorkflowRequest {
    cardInfo: CreditCardInfo;
    billingAddress: BillingAddressInfo;
    transactionId: string;
}

export type UpdatePaymentWorkflowServiceError = 'CREDIT_CARD_FAILURE' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class UpdatePaymentWorkflowService implements DataWorkflow<UpdatePaymentServiceWorkflowRequest, boolean> {
    constructor(private readonly _store: Store, private readonly _dataUpdatePaymentService: DataUpdatePaymentService) {}

    build(request: UpdatePaymentServiceWorkflowRequest): Observable<boolean> {
        return this._dataUpdatePaymentService.updatePayment(request).pipe(
            map((response) => response === 'SUCCESS'),
            catchError((error) => this._errorHandler(error))
        );
    }

    private _errorHandler(error) {
        const errorCode = error?.errorCode || (Array.isArray(error?.fieldErrors) && error?.fieldErrors?.length > 0 && error.fieldErrors[0].errorCode);
        if (errorCode?.includes('CREDIT_CARD') || errorCode?.includes('CC_')) {
            this._store.dispatch(behaviorEventErrorFromBusinessLogic({ message: 'CREDIT_CARD_FAILURE', errorCode: errorCode }));
            return throwError('CREDIT_CARD_FAILURE' as UpdatePaymentWorkflowServiceError);
        }
        return throwError(error);
    }
}
