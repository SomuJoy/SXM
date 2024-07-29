import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';

export interface NextBestActionResponse {
    identificationState: IdentificationState;
    customerSegment: CustomerSegment;
    actions: NextBestAction[];
}

export type IdentificationState = 'UNIDENTIFIED' | 'IDENTIFIED' | 'LOGGEDIN';

export type CustomerSegment =
    | 'NONPAY'
    | 'SATELLITE_TRIALER'
    | 'STREAMING_TRIALER'
    | 'SELFPAY_PLATINUM'
    | 'SELFPAY_ME'
    | 'SELFPAY_MUSICSHOWCASE'
    | 'SELFPAY_NST'
    | 'SELFPAY_STREAMING_PLATINUM'
    | 'SELFPAY_STREAMING_ME'
    | 'SELFPAY_STREAMING_MUSICSHOWCASE'
    | 'INACTIVE';

export type NextBestActionType = 'PAYMENT' | 'SC_AC' | 'PAYMENT_REMINDER' | 'CONVERT' | 'CREDENTIALS' | 'CONTENT' | 'DEVICES' | 'UPGRADE' | 'REACTIVATE';

export interface NextBestAction {
    type: NextBestActionType;
    subscriptionId: string;
    last4DigitsOfRadioId?: string;
    noOfDaysLeftInTrial?: number;
    endDate?: string;
    favoriteChannel?: string;
    hasActiveAudioSelfPayOrPromo?: boolean;
    hasActiveAudioTrialPlan?: boolean;
    subHasStreamingCredentials?: boolean;
    accountRegistered?: boolean;
}

type ActionErrorCodes = '';
type FieldErrorCodes = '';

// TODO: url changed from account-mgmt/ to account/, update the reset of the data-service naming to match, move to appropriate location
const ENDPOINT_URL = '/account/next-best-action';

@Injectable({ providedIn: 'root' })
export class DataAccountNextBestActionService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getNextBestActions(): Observable<NextBestActionResponse> {
        const options = { withCredentials: true };
        return this._get<NextBestActionResponse, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, options);
    }
}
