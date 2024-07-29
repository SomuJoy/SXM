import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataMakePaymentService, CreditCardInfo, BillingAddressInfo } from '../data-services/data-make-payment.service';
import { behaviorEventErrorFromBusinessLogic } from '@de-care/shared/state-behavior-events';

interface MakePaymentServiceWorkflowRequest {
    cardInfo: CreditCardInfo;
    billingAddress: BillingAddressInfo;
    paymentAmount: number;
    transactionId: string;
    oneTimePayment: boolean;
}

export type MakePaymentWorkflowServiceError = 'CREDIT_CARD_FAILURE' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class MakePaymentWorkflowService implements DataWorkflow<MakePaymentServiceWorkflowRequest, boolean> {
    constructor(private readonly _store: Store, private readonly _dataMakePaymentService: DataMakePaymentService) {}

    build(request: MakePaymentServiceWorkflowRequest): Observable<boolean> {
        const serviceRequest = {
            paymentInfo: {
                useCardOnfile: false,
                paymentType: 'creditCard',
                cardInfo: request.cardInfo,
                paymentAmount: request.paymentAmount,
                transactionId: request.transactionId,
                oneTimePayment: request.oneTimePayment,
            },
            billingAddress: request.billingAddress,
        };
        return this._dataMakePaymentService.makePayment(serviceRequest).pipe(
            map((response) => response === 'SUCCESS'),
            catchError((error) => this._errorHandler(error))
        );
    }

    private _errorHandler(error) {
        const errorCode = error?.errorCode || (Array.isArray(error?.fieldErrors) && error?.fieldErrors?.length > 0 && error.fieldErrors[0].errorCode);
        if (errorCode?.includes('CREDIT_CARD') || errorCode?.includes('CC_')) {
            this._store.dispatch(behaviorEventErrorFromBusinessLogic({ message: 'CREDIT_CARD_FAILURE', errorCode: errorCode }));
            return throwError('CREDIT_CARD_FAILURE' as MakePaymentWorkflowServiceError);
        }
        return throwError(error);
    }
}
