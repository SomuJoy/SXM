import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface AvsWorkflowState {
    currentWorkflow: AvsWorkflows;
    correctedAddresses?: AvsWorkflowStateAddress[];
    currentAddress: {
        addressLine1: string;
        city: string;
        state: string;
        zip: number;
    };
    validated: boolean;
    hasError: boolean;
    addressCorrectionAction: number;
}

export interface AvsWorkflowStateAddress {
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
}

export type AvsWorkflows = 'BILLING_ADDRESS_MODAL' | 'SERVICE_ADDRESS_MODAL' | 'EDIT_BILLING_ADDRESS' | 'EDIT_SERVICE_ADDRESS' | 'COMPLETED';

@Injectable()
export class AddressVerificationStateService {
    avsWorkflowState$: Observable<AvsWorkflowState>;
    private _avsWorkflowState$: Subject<AvsWorkflowState>;
    private _avsState;

    constructor() {
        this._avsWorkflowState$ = new Subject<AvsWorkflowState>();
        this.avsWorkflowState$ = this._avsWorkflowState$.asObservable();
    }

    setAvsInitialState(state) {
        this._avsState = state;
        if (this._avsState.billingAddress) {
            this._emitAvsWorkflow(this._avsState.billingAddress, 'BILLING_ADDRESS_MODAL');
        } else if (this._avsState.serviceAddress) {
            this._emitAvsWorkflow(this._avsState.serviceAddress, 'SERVICE_ADDRESS_MODAL');
        } else {
            this._emitAvsWorkflow({}, 'COMPLETED');
        }
    }

    skipVerification() {
        this._emitAvsWorkflow({}, 'COMPLETED');
    }

    correctedBillingAddressAccepted(serviceSameAsBilling = false) {
        if (this._avsState.billingAddress) {
            this._avsState.billingAddress = null;
        }
        if (this._avsState.serviceAddress && !serviceSameAsBilling) {
            this._emitAvsWorkflow(this._avsState.serviceAddress, 'SERVICE_ADDRESS_MODAL');
        } else {
            this._emitAvsWorkflow({}, 'COMPLETED');
        }
    }

    correctedServiceAddressAccepted() {
        if (this._avsState.serviceAddress) {
            this._avsState.serviceAddress = null;
        }
        this._emitAvsWorkflow({}, 'COMPLETED');
    }

    private _emitAvsWorkflow(
        { correctedAddresses = null, currentAddress = null, validated = false, hasError = false, addressCorrectionAction = 0 },
        currentWorkflow: AvsWorkflows
    ) {
        this._avsWorkflowState$.next({
            currentWorkflow,
            correctedAddresses,
            currentAddress,
            validated,
            hasError,
            addressCorrectionAction
        });
    }

    setAvsToEditAddressMode(avsWorkflow: AvsWorkflows) {
        if (avsWorkflow === 'BILLING_ADDRESS_MODAL') {
            this._emitAvsWorkflow({ hasError: this._avsState.billingAddress && !this._avsState.billingAddress.correctedAddress }, 'EDIT_BILLING_ADDRESS');
        } else if (avsWorkflow === 'SERVICE_ADDRESS_MODAL') {
            this._emitAvsWorkflow({ hasError: this._avsState.serviceAddress && !this._avsState.serviceAddress.correctedAddress }, 'EDIT_SERVICE_ADDRESS');
        }
    }
}
