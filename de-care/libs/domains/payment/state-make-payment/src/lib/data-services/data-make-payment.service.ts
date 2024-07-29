import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';

export interface MakePaymenteRequest {
    paymentInfo: PaymentInfo;
    billingAddress: BillingAddressInfo;
}

export interface PaymentInfo {
    useCardOnfile: boolean;
    paymentType: string;
    paymentAmount: number;
    transactionId: string;
    cardInfo?: CreditCardInfo;
}

export interface CreditCardInfo {
    cardType?: string;
    cardNumber: string;
    expiryMonth: number;
    expiryYear: number;
    nameOnCard: string;
}

export interface BillingAddressInfo {
    avsvalidated: boolean;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

type ActionErrorCodes = 'SYSTEM';
type FieldErrorCodes = '';

const ENDPOINT_URL = '/payment/make-payment';

@Injectable({ providedIn: 'root' })
export class DataMakePaymentService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    makePayment(paymentRequest: MakePaymenteRequest): Observable<string> {
        return this._post<MakePaymenteRequest, string, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, paymentRequest, {
            withCredentials: true,
        });
    }
}
