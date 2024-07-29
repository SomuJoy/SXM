import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';
import { Account } from './account.interface';

export interface AccountVipElegibleRadiosFromTokenRequest {
    student: boolean;
    token: string;
    tokenType: string;
}

export type AccountVipElegibleRadiosFromTokenRequestResponse = {
    nonPIIAccount: Account;
    eligibleSecondarySubscriptions: AccountVipElegibleRadiosFromTokenSubscription[];
    eligibleSecondaryStreamingSubscriptions: AccountVipElegibleStreamingSubscription[];
};

type AccountVipElegibleRadiosFromTokenSubscription = {
    id: string;
    status: string;
    radioService: {
        last4DigitsOfRadioId: string;
        vehicleInfo?: {
            year: number;
            make: string;
            model: string;
        };
    };
    plans?: {
        code: string;
        packageName: string;
        termLength: number;
        startDate: string;
        endDate: string;
        nextCycleOn: string;
        marketType: string;
        type: string;
        capabilities: string[];
        price: number;
        isBasePlan: boolean;
        dataCapable: boolean;
    }[];
};

type AccountVipElegibleStreamingSubscription = {
    id: string;
    plans?: {
        code: string;
        label: string;
        packageName: string;
        termLength: number;
        startDate: string;
        endDate: string;
        nextCycleOn: string;
        marketType: string;
        type: string;
        capabilities: string[];
        price: number;
        isBasePlan: boolean;
        dataCapable: boolean;
    }[];
    status: string;
    isPrimary: boolean;
    streamingService: {
        id: string;
        userName: string;
        maskedUserName: string;
        status: string;
        randomCredentials: boolean;
    };
};
type FieldErrorCodes = 'SUBSCRIPTION_HAS_VIP_PLATINUM_PACKAGE_ON_2_RADIOS' | 'SUBSCRIPTION_NOT_ELIGIBLE_FOR_SECOND_RADIO';

const ENDPOINT_URL = '/account/token/vip-eligible-radios';

@Injectable({ providedIn: 'root' })
export class AccountVipElegibleRadiosFromTokenService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getSecondarySubscription(request: AccountVipElegibleRadiosFromTokenRequest): Observable<AccountVipElegibleRadiosFromTokenRequestResponse> {
        const options = {
            withCredentials: true,
        };
        return this._post<AccountVipElegibleRadiosFromTokenRequest, AccountVipElegibleRadiosFromTokenRequestResponse, null, FieldErrorCodes>(
            `${this._apiUrl}${ENDPOINT_URL}`,
            request,
            options
        );
    }
}
