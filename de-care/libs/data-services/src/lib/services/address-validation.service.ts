import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddressValidation, CustomerValidateResponse, CustomerValidation, DataValidationService } from './data-validation.service';

export enum AddressCorrectionAction {
    Suggest,
    AutoCorrect,
    VerifyAddress
}

export interface AvsValidationState {
    billingAddress?: AddressValidationState;
    serviceAddress?: AddressValidationState;
    isValidCCNumber?: boolean;
}

export interface AddressValidationState {
    addressCorrectionAction: AddressCorrectionAction;
    validated: boolean;
    correctedAddresses?: AddressValidationStateAddress[];
}

export interface AddressValidationStateAddress {
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
}

@Injectable({ providedIn: 'root' })
export class AddressValidationService {
    constructor(private _dataValidationService: DataValidationService) {}

    validateAddresses(payload: CustomerValidation): Observable<AvsValidationState> {
        return this._dataValidationService.validateCustomerInfo(payload, false).pipe(map(customerValidateResponse => this._parseAddressValidation(customerValidateResponse)));
    }

    private _parseAddressValidation(addressSuggested: CustomerValidateResponse): AvsValidationState {
        const avsValidationState: AvsValidationState = {
            billingAddress: null,
            serviceAddress: null,
            isValidCCNumber: false
        };
        if (addressSuggested) {
            avsValidationState.billingAddress = this._parseSingleAddress(addressSuggested.billingAddressValidation);
            avsValidationState.serviceAddress = this._parseSingleAddress(addressSuggested.serviceAddressValidation);
            avsValidationState.isValidCCNumber = addressSuggested.ccValidation ? addressSuggested.ccValidation.valid : false;
        }
        return avsValidationState;
    }

    private _parseSingleAddress(addressValidation: AddressValidation): AddressValidationState | null {
        if (!addressValidation) {
            return null;
        }
        switch (addressValidation.confidenceLevel) {
            case 'None':
            case 'BLANK': {
                return {
                    validated: false,
                    addressCorrectionAction: AddressCorrectionAction.VerifyAddress,
                    correctedAddresses: []
                };
            }
            default: {
                let correctedAddresses = [];
                if (addressValidation.correctedAddress && addressValidation.correctedAddress.length > 0) {
                    correctedAddresses = addressValidation.correctedAddress.map(data => {
                        const address = data;
                        let addressLine = address.addressLine1;
                        if (address.addressLine2) {
                            addressLine += ` ${address.addressLine2}`;
                        }
                        return {
                            addressLine1: addressLine,
                            city: address.city,
                            state: address.state,
                            zip: address.zip
                        };
                    });
                }
                return {
                    validated: true,
                    addressCorrectionAction:
                        addressValidation.confidenceLevel === 'Verified'
                            ? AddressCorrectionAction.AutoCorrect
                            : addressValidation.confidenceLevel === 'InteractionRequired' || addressValidation.confidenceLevel === 'Multiple'
                            ? AddressCorrectionAction.Suggest
                            : AddressCorrectionAction.VerifyAddress,
                    correctedAddresses
                };
            }
        }
    }
}
