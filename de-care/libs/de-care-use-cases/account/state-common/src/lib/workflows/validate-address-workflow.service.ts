import { Injectable } from '@angular/core';
import {
    ValidatePaymentInfoWorkflowError,
    ValidatePaymentInfoWorkflowService,
    ValidatePaymentInfoWorkflowResult,
} from '@de-care/domains/customer/state-customer-verification';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ValidateAddressWorkflowRequest {
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
}
export type ValidateAddressWorkflowWorkflowResult = ValidatePaymentInfoWorkflowResult;
export type ValidateAddressWorkflowWorkflowError = ValidatePaymentInfoWorkflowError;

@Injectable({ providedIn: 'root' })
export class ValidateAddressWorkflowService implements DataWorkflow<ValidateAddressWorkflowRequest, ValidateAddressWorkflowWorkflowResult> {
    constructor(private readonly _store: Store, private readonly _validatePaymentInfoWorkflowService: ValidatePaymentInfoWorkflowService) {}

    build(paymentInfo) {
        return this._validatePaymentInfoWorkflowService.build(paymentInfo).pipe(
            catchError((error) => {
                // TODO: If needed, additional address validation logic
                return throwError(error);
            })
        );
    }
}
