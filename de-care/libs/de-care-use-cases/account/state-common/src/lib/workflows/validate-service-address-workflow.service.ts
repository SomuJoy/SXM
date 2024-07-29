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

export interface ValidateServiceAddressWorkflowRequest {
    serviceAddress: {
		addressLine1: string;
	    city: string;
	    state: string;
	    zip: string;
	};
    skipAddressValidation: boolean;
}

export type ValidateServiceAddressWorkflowWorkflowResult = ValidatePaymentInfoWorkflowResult;
export type ValidateServiceAddressWorkflowWorkflowError = ValidatePaymentInfoWorkflowError;

@Injectable({ providedIn: 'root' })
export class ValidateServiceAddressWorkflowService implements DataWorkflow<ValidateServiceAddressWorkflowRequest, ValidateServiceAddressWorkflowWorkflowResult> {
    constructor(private readonly _store: Store, private readonly _validatePaymentInfoWorkflowService: ValidatePaymentInfoWorkflowService) {}

    build(request) {
		const paymentInfo = { paymentInfo: { ...request.serviceAddress }, skipAddressValidation: request.skipAddressValidation };
        return this._validatePaymentInfoWorkflowService.build(paymentInfo).pipe(
            catchError((error) => {
                // TODO: If needed, additional address validation logic
                return throwError(error);
            })
        );
    }
}
