import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';

export interface UpdateSubscriptionNicknameRequest {
    nickName: string;
    subscriptionId: string;
    accountNumber?: string;
}

export interface UpdateSubscriptionNicknameResponse {
    status: string;
}
type ActionErrorCodes = '';
type FieldErrorCodes = '';
const ENDPOINT_URL = '/account-mgmt/update-nickname';

@Injectable({ providedIn: 'root' })
export class UpdateSubscriptionNicknameService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    build(request: UpdateSubscriptionNicknameRequest): Observable<UpdateSubscriptionNicknameResponse> {
        return this._post<UpdateSubscriptionNicknameRequest, UpdateSubscriptionNicknameResponse, ActionErrorCodes, FieldErrorCodes>(
            `${this._apiUrl}${ENDPOINT_URL}`,
            request,
            {
                withCredentials: true,
            }
        );
    }
}
