import { Injectable } from '@angular/core';
import {
    ValidatePaymentInfoWorkflowError,
    ValidatePaymentInfoWorkflowService,
    ValidatePaymentInfoWorkflowResult,
} from '@de-care/domains/customer/state-customer-verification';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CheckoutValidateAddressWorkflowRequest {
    paymentInfo: {
        addressLine1: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        nameOnCard: string;
        cardNumber: string;
        expirationDate: string;
        cvv: string;
    };
    skipAddressValidation: boolean;
}
export type CheckoutValidateAddressWorkflowWorkflowResult = ValidatePaymentInfoWorkflowResult;
export type CheckoutValidateAddressWorkflowWorkflowError = ValidatePaymentInfoWorkflowError;

@Injectable({ providedIn: 'root' })
export class CheckoutValidateAddressWorkflowService implements DataWorkflow<CheckoutValidateAddressWorkflowRequest, CheckoutValidateAddressWorkflowWorkflowResult> {
    constructor(private readonly _validatePaymentInfoWorkflowService: ValidatePaymentInfoWorkflowService) {}

    build(paymentInfo: CheckoutValidateAddressWorkflowRequest) {
        return this._validatePaymentInfoWorkflowService.build(paymentInfo).pipe(
            catchError((error) => {
                // TODO: If needed, additional address validation logic
                return throwError(error);
            })
        );
    }
}
