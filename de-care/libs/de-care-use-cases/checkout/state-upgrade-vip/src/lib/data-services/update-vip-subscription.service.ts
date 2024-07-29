import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';

export type UpdateVipSubscriptionPayload = {
    radioId?: string;
    subscriptionId?: string;
    plans: {
        planCode: string;
    }[];
    emailAddressChanged: boolean;
    paymentInfo: {
        useCardOnfile: boolean;
    };
};

export type UpdateVipSubscriptionResponse = {
    email: string;
    status: string;
    radioId: string;
    subscriptionId: string;
    maskedStreamingUserName: string;
    accountNumber: string;
    maskedPhoneNumber: string;
    isTwoFactorAuthNeeded: boolean;
    isEligibleForRegistration: boolean;
    isOfferStreamingEligible: boolean;
    isEligibleForStreamingCredentialsOnly: boolean;
    isUserNameSameAsEmail: boolean;
};

const ENDPOINT_URL = '/purchase/update-vip-subscription';

@Injectable({ providedIn: 'root' })
export class UpdateVipSubscriptionService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    updateSecondarySubscription(request: UpdateVipSubscriptionPayload): Observable<UpdateVipSubscriptionResponse> {
        const options = {
            withCredentials: true,
        };
        return this._post<UpdateVipSubscriptionPayload, UpdateVipSubscriptionResponse, null, null>(`${this._apiUrl}${ENDPOINT_URL}`, request, options);
    }
}
