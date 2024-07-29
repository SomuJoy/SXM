import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { MicroservicesResponse } from './microservice-response.interface';
import {
    CustomerValidation,
    CustomerValidateResponse,
    AvsValidationState,
    AddressValidation,
    AddressValidationState,
    AddressCorrectionAction,
} from './customer-validation.interface';

const ENDPOINT_URL = '/validate/customer-info';

@Injectable({ providedIn: 'root' })
export class CustomerValidationService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    private _sendRequest(payload: CustomerValidation): Observable<CustomerValidateResponse> {
        const options = {
            withCredentials: true,
        };

        if (payload.username) {
            payload.username.reuseUserName = true;
        }

        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap((url) =>
                this._http.post<MicroservicesResponse<CustomerValidateResponse>>(`${url}${ENDPOINT_URL}`, payload, options).pipe(
                    map((response) => {
                        return response.data;
                    })
                )
            )
        );
    }

    private _parseAddressValidation(addressSuggested: CustomerValidateResponse): AvsValidationState {
        const avsValidationState: AvsValidationState = {
            billingAddress: null,
            serviceAddress: null,
            ccValidation: null,
        };

        if (addressSuggested) {
            avsValidationState.billingAddress = this._parseSingleAddress(addressSuggested.billingAddressValidation);
            avsValidationState.serviceAddress = this._parseSingleAddress(addressSuggested.serviceAddressValidation);
        }

        if (addressSuggested.ccValidation) {
            avsValidationState.ccValidation = addressSuggested.ccValidation;
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
                    correctedAddresses: [],
                };
            }
            default: {
                let correctedAddresses = [];
                if (addressValidation.correctedAddress && addressValidation.correctedAddress.length > 0) {
                    correctedAddresses = addressValidation.correctedAddress.map((data) => {
                        const address = data;
                        let addressLine = address.addressLine1;
                        if (address.addressLine2) {
                            addressLine += ` ${address.addressLine2}`;
                        }
                        return {
                            addressLine1: addressLine,
                            city: address.city,
                            state: address.state,
                            zip: address.zip,
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
                    correctedAddresses,
                };
            }
        }
    }

    validateAddresses(payload: CustomerValidation): Observable<AvsValidationState> {
        return this._sendRequest(payload).pipe(map((customerValidateResponse) => this._parseAddressValidation(customerValidateResponse)));
    }

    validate(payload: CustomerValidation) {
        return this._sendRequest(payload);
    }
}
