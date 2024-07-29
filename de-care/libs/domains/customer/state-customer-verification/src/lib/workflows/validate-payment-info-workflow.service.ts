import { Injectable } from '@angular/core';
import { AddressValidationStateAddress, AvsValidationState } from '../data-services/customer-validation.interface';
import { CustomerValidationAddressesWorkFlowService } from './customer-validation-addresses.workflow.service';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

interface ValidatePaymentInfoWorkflowRequest {
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

export type ValidatePaymentInfoWorkflowResult = {
    correctedAddress?: {
        addressLine1: string;
        city: string;
        state: string;
        zip: string;
        avsValidated: boolean;
    };
};
export interface ValidatePaymentInfoWorkflowError {
    status: 'ADDRESS_CONFIRMATION_NEEDED';
    correctedAddresses?: AddressValidationStateAddress[];
    addressCorrectionAction?: AddressCorrectionAction;
    validated?: boolean;
}

enum AddressCorrectionAction {
    Suggest,
    AutoCorrect,
    VerifyAddress,
}

@Injectable({ providedIn: 'root' })
export class ValidatePaymentInfoWorkflowService implements DataWorkflow<ValidatePaymentInfoWorkflowRequest, ValidatePaymentInfoWorkflowResult> {
    constructor(private readonly _store: Store, private readonly _customerValidationAddressesWorkFlowService: CustomerValidationAddressesWorkFlowService) {}

    build({ paymentInfo, skipAddressValidation = false }): Observable<ValidatePaymentInfoWorkflowResult> {
        const serviceAddressSubmitted = {
            addressLine1: paymentInfo.addressLine1,
            city: paymentInfo.city,
            state: paymentInfo.state,
            zip: paymentInfo.zip,
        };
        const creditCardNumber = paymentInfo.cardNumber;

        const addressValidation$ = this._customerValidationAddressesWorkFlowService
            .build({ serviceAddress: serviceAddressSubmitted, ...(creditCardNumber && { creditCard: { creditCardNumber } }) })
            .pipe(
                map<AvsValidationState, ValidatePaymentInfoWorkflowResult>(({ serviceAddress }) => {
                    switch (serviceAddress.addressCorrectionAction) {
                        case AddressCorrectionAction.AutoCorrect: {
                            const correctedAddress = serviceAddress?.correctedAddresses?.[0];
                            if (correctedAddress) {
                                const normalizedCorrectedAddress = {
                                    ...correctedAddress,
                                    addressLine1: correctedAddress?.addressLine1?.trim(),
                                    city: correctedAddress?.city?.trim(),
                                    state: correctedAddress?.state?.trim(),
                                };
                                return { correctedAddress: { ...normalizedCorrectedAddress, avsValidated: serviceAddress.validated } };
                            }
                            return {};
                        }
                        case AddressCorrectionAction.VerifyAddress:
                        case AddressCorrectionAction.Suggest: {
                            throw {
                                status: 'ADDRESS_CONFIRMATION_NEEDED',
                                correctedAddresses: serviceAddress?.correctedAddresses,
                                addressCorrectionAction: serviceAddress?.addressCorrectionAction,
                                validated: serviceAddress?.validated,
                            } as ValidatePaymentInfoWorkflowError;
                        }
                    }
                })
            );

        if (skipAddressValidation) {
            return of({});
        } else {
            return addressValidation$;
        }
    }
}
