import { Injectable } from '@angular/core';
import { AddressCorrectionAction, AvsValidationState, CustomerValidationAddressesWorkFlowService } from '@de-care/domains/customer/state-customer-verification';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { setSuggestedRegistrationServiceAddressSuggestions } from '../state/actions';

interface WorkflowPayload {
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
}

interface WorkflowResponse {
    validated: boolean;
    autoCorrectAddress?: {
        addressLine1: string;
        city: string;
        state: string;
        zip: string;
    };
}

@Injectable({ providedIn: 'root' })
export class ValidateRegistrationServiceAddressWorkflowService implements DataWorkflow<WorkflowPayload, WorkflowResponse> {
    constructor(private readonly _customerValidationAddressesWorkFlowService: CustomerValidationAddressesWorkFlowService, private readonly _store: Store) {}

    build(payload: WorkflowPayload): Observable<WorkflowResponse> {
        return this._customerValidationAddressesWorkFlowService.build({ serviceAddress: payload }).pipe(
            map<AvsValidationState, WorkflowResponse>(({ serviceAddress }) => {
                const correctedAddressExists = Array.isArray(serviceAddress?.correctedAddresses) && serviceAddress?.correctedAddresses.length > 0;
                if (serviceAddress?.addressCorrectionAction === AddressCorrectionAction.AutoCorrect && correctedAddressExists) {
                    return { validated: serviceAddress?.validated, autoCorrectAddress: { ...serviceAddress?.correctedAddresses[0] } };
                } else {
                    this._store.dispatch(
                        setSuggestedRegistrationServiceAddressSuggestions({
                            correctedAddresses: serviceAddress?.correctedAddresses,
                            addressCorrectionAction: serviceAddress?.addressCorrectionAction,
                            correctedAddressIsAvsValidated: serviceAddress?.validated
                        })
                    );
                    return { validated: false };
                }
            })
        );
    }
}
