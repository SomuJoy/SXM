import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiPrefix } from '@de-care/settings';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { Subscription, ClosedDeviceModel, Account } from './account.interface';
import { MicroservicesResponse } from './microservice-response.interface';
import { select, Store } from '@ngrx/store';

export interface AcscRequest {
    radioId?: string;
    subscriptionId?: string;
    swapFlow?: boolean;
}

export interface AccountAcscResponse {
    trialAccount: Account;
    sCEligibleSelfPaySubscriptions: Subscription[];
    sCEligibleClosedDevices: ClosedDeviceModel[];
    eligibilityStatus: EligibilityStatus;
    sPEligibleSelfPaySubscriptionIds: string[];
    sPEligibleClosedRadioIds?: string[];
}

export type EligibilityStatus = 'AC_AND_SC' | 'AC_ONLY' | 'SC_ONLY' | 'TRIAL_ALREADY_CONSOLIDATED_AND_HAS_FOLLOWON' | 'TRIAL_ALREADY_CONSOLIDATED_AND_NO_FOLLOWON' | 'SWAP';

const ENDPOINT_URL = '/account/acsc';
@Injectable({ providedIn: 'root' })
export class DataAccountAcscService {
    constructor(private _http: HttpClient, private _store: Store) {}
    getAccount(request: AcscRequest): Observable<AccountAcscResponse> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap((url) => this._http.post<MicroservicesResponse<AccountAcscResponse>>(`${url}${ENDPOINT_URL}`, request, options)),
            map((response) => response.data)
        );
    }
}
