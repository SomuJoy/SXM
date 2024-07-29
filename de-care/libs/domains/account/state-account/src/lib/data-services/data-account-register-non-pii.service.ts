import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiPrefix } from '@de-care/settings';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { Subscription } from './account.interface';
import { MicroservicesResponse } from './microservice-response.interface';

const ENDPOINT_URL = '/account/registration/non-pii';

export interface RegisterNonPiiRequest {
    accountNumber?: string;
    radioId?: string;
}

export interface RegisterNonPiiResponse {
    maskedPhoneNumber?: string;
    hasPhoneNumberOnFile?: boolean;
    hasEmailAddressOnFile?: boolean;
    last4DigitsOfAccountNumber?: string;
    hasDemoSubscription: boolean;
    userName?: string;
    firstName?: string;
    subscriptions: Subscription[];
    accountState: {
        isInPreTrial?: boolean;
    };
    accountProfile?: {
        accountRegistered?: boolean;
    };
}

@Injectable({ providedIn: 'root' })
export class DataAccountRegisterNonPiiService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    getRegisterNon(request: RegisterNonPiiRequest): any {
        const options = { withCredentials: true };

        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap((url) =>
                this._http.post<MicroservicesResponse<RegisterNonPiiResponse>>(`${url}${ENDPOINT_URL}`, request, options).pipe(
                    map((response) => {
                        if (response?.data) {
                            return response.data;
                        } else {
                            return response;
                        }
                    })
                )
            )
        );
    }
}
