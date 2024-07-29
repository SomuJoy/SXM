import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';

const ENDPOINT_URL = '/billing/activity';

interface RequestModel {
    startDate?: string;
    endDate?: string;
    numItems?: number;
    transactionType?: 'subscription' | 'payment';
}
interface ResponseModel {
    billItems: BillItem[];
}
interface BillItem {
    eventType: 'Subscription' | 'Payment';
    startDate: string;
    endDate: string;
    transactionDate: number;
    billNumber: string;
    serviceFor: string;
    description: string;
    amount: number;
    radioId: string;
    sXIRLogin: string;
}

type ActionErrorCodes = 'SYSTEM';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class DataBillingActivityService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getBillingActivity(payload: RequestModel): Observable<ResponseModel> {
        return this._post<RequestModel, ResponseModel, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true });
    }
}
