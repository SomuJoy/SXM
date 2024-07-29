import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { HttpClient } from '@angular/common/http';

const ENDPOINT_URL = '/10footdevice/register';

interface RequestModel {
    activationCode: string;
    username: string;
    password: string;
}

interface ResponseModel {
    status: string;
}

type ActionErrorCodes =
    | 'INTERNAL_SERVER_ERROR'
    | 'HEADER_X_FORWARDED_FOR_REQUIRED'
    | 'GENERIC_ERROR_CODE'
    | 'LDAP_FAILURE'
    | 'INVALID_CHANNEL_LINEUP_ID'
    | 'DEVICE_NOT_REGISTERED'
    | 'DEVICE_REGISTRATION_FAILED'
    | 'INVALID_REQUEST';
type FieldErrorCodes =
    | 'INVALID_REGION'
    | 'INVALID_DEVICE_ID'
    | 'INVALID_PASSCODE'
    | 'PASSCODE_EXPIRED'
    | 'INVALID_DEVICE_TYPE'
    | 'TOKEN_VAILDATION_FAILED'
    | 'INVALID_TOKEN'
    | 'ACCOUNT_LOCKOUT_ERROR'
    | 'INVALID_USERNAME_OR_PASSWORD'
    | 'ACCOUNT_IS_INACTIVE'
    | 'SUBSCRIBER_ACCOUNT_IS_CLOSED'
    | 'PROSPECT_ACCOUNT_IS_EXPIRED'
    | 'GRANDFATHER_ACCOUNT_CANNOT_ACCESS';

@Injectable({ providedIn: 'root' })
export class Data10FootDeviceRegisterService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    register(payload: RequestModel): Observable<ResponseModel> {
        return this._post<RequestModel, ResponseModel, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true });
    }
}
