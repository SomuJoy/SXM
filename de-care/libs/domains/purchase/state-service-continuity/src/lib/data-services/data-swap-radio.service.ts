import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';

export interface SwapRadioResponse {
    isUserNameSameAsEmail: boolean;
    email: string;
    status: string;
    isOfferStreamingEligible: boolean;
    subscriptionId?: string;
    isEligibleForRegistration: boolean;
    radioId?: string;
}

export interface PaymentInfoModel {
    cardInfo?: {
        cardNumber: string;
        cardType?: string;
        dateOfBirth?: string;
        expiryMonth: string;
        expiryYear: string;
        nameOnCard: string;
        securityCode?: string;
    };
    useCardOnfile: boolean;
    transactionId: string;
    giftCards?: string[];
    paymentType?: string;
    paymentAmount?: number;
}

export interface Address {
    addressType?: string;
    company?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    middleInitial?: string;
    phone?: string;
    specialNotes?: string;
    avsvalidated: boolean;
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}

export interface SwapRadioRequest {
    newRadioId: string;
    oldRadioId: string;
    paymentInfo: PaymentInfoModel;
    billingAddress?: Address;
}

type ActionErrorCodes = '';
type FieldErrorCodes = '';

const ENDPOINT_URL = '/purchase/swap-radio';

@Injectable({ providedIn: 'root' })
export class DataSwapRadioService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    swap(request: SwapRadioRequest): Observable<SwapRadioResponse> {
        const options = { withCredentials: true };
        return this._post<SwapRadioRequest, SwapRadioResponse, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, request, options);
    }
}
