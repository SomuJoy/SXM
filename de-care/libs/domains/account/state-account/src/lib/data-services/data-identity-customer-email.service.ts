import { Injectable, Inject } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { HttpClient } from '@angular/common/http';

const ENDPOINT_URL = '/identity/customer/email';
interface Request {
    email: string;
    phoneNumber?: string;
}
interface Response {
    closed: boolean;
    id: string;
    status: string;
    plans: Plan[];
    followonPlans: Plan[];
    radioService?: RadioService;
    streamingService: StreamingService;
}
interface Plan {
    code: string;
    packageName: string;
    termLength: string;
    endDate: null;
    type: string;
    marketType: string;
    capabilities: string[];
}
interface RadioService {
    last4DigitsOfRadioId: string;
    vehicleInfo: VehicleInfo;
    maskedRadioId: string;
}
interface VehicleInfo {
    model?: string;
    make?: string;
    year?: string;
}
interface StreamingService {
    status: string;
    maskedUserName: string;
    randomCredentials: boolean;
}

type ActionErrorCodes = '';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class DataIdentityCustomerEmailService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getAccount(payload: { email: string; phoneNumber?: string }) {
        return this._post<Request, Response, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true });
    }
}
