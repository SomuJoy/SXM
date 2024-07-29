import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { HttpClient } from '@angular/common/http';

const ENDPOINT_URL = '/10footdevice/validate-code';

interface RequestModel {
    activationCode: string;
}

interface ResponseModel {
    status: string;
    deviceType: string;
    deviceId: string;
}

type ActionErrorCodes = 'INTERNAL_SERVER_ERROR' | 'HEADER_X_FORWARDED_FOR_REQUIRED' | 'GENERIC_ERROR_CODE' | 'LDAP_FAILURE' | 'INVALID_CHANNEL_LINEUP_ID';
type FieldErrorCodes =
    | 'INVALID_PASSCODE'
    | 'ACCOUNT_LOCKOUT_ERROR'
    | 'INVALID_REGION'
    | 'INVALID_DEVICE_ID'
    | 'INVALID_REQUEST'
    | 'INVALID_USERNAME_OR_PASSWORD'
    | 'ACCOUNT_IS_INACTIVE'
    | 'SUBSCRIBER_ACCOUNT_IS_CLOSED'
    | 'PROSPECT_ACCOUNT_IS_EXPIRED'
    | 'AUTHENTICATION_FAILED'
    | 'PASSCODE_EXPIRED'
    | 'DEVICE_NOT_REGISTERED'
    | 'INVALID_DEVICE_TYPE'
    | 'GRANDFATHER_ACCOUNT_CANNOT_ACCESS'
    | 'TOKEN_VAILDATION_FAILED'
    | 'DEVICE_REGISTRATION_FAILED'
    | 'INVALID_TOKEN';

@Injectable({ providedIn: 'root' })
export class Data10FootDeviceValidateCodeService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    validate(payload: RequestModel): Observable<ResponseModel> {
        return this._post<RequestModel, ResponseModel, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true });
    }
}
