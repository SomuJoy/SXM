import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable, of } from 'rxjs';

export interface ModifySubscriptionOptionsRequest {
    subscriptionId: string | number;
}

export interface ModifySubscriptionOptionsResponse {
    options: options[];
    cancelSubscriptionOptionInfo: {
        showViewOffer: boolean;
        showTransferRadio: boolean;
        showCancelOnline: boolean;
        showCancelViaChat: boolean;
        triggeredRuleId: string | number;
    };
}
type options = 'CHANGE_PLAN' | 'CHANGE_TERM' | 'REFRESH_RADIO' | 'DOWNLOAD_MANUAL' | 'REPLACE_RADIO' | 'TRANSFER_SUBSCRIPTION' | 'CANCEL_SUBSCRIPTION';

type ActionErrorCodes = '';
type FieldErrorCodes = '';

const ENDPOINT_URL = '/account-mgmt/modify-subscription-options';

@Injectable({ providedIn: 'root' })
export class ModifySubscriptionOptionsService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getSubscriptionOptions(request: ModifySubscriptionOptionsRequest): Observable<ModifySubscriptionOptionsResponse> {
        const options = { withCredentials: true };
        return this._post<ModifySubscriptionOptionsRequest, ModifySubscriptionOptionsResponse, ActionErrorCodes, FieldErrorCodes>(
            `${this._apiUrl}${ENDPOINT_URL}`,
            request,
            options
        );
    }
}
