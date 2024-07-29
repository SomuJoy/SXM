import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ALLOW_ERROR_HANDLER_HEADER, getApiPrefix } from '@de-care/settings';
import { concatMap, map, take } from 'rxjs/operators';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { select, Store } from '@ngrx/store';
import { Account } from './account.interface';

const ENDPOINT_URL = '/account/upgrade-vip';

type DataAccountVIPServiceParams = {
    accountNumber: string;
    radioId: string;
    lastName: string;
    subscriptionId: string;
};

type DataAccountVIPServiceResponse = {
    nonPIIAccount: Account;
    eligibleSecondarySubscriptions: DataAccountVipEligibleSubscription[];
    eligibleSecondaryStreamingSubscriptions: DataAccountVipElegibleStreamingSubscription[];
};
type DataAccountVipElegibleStreamingSubscription = {
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

type DataAccountVipEligibleSubscription = {
    status: string;
    radioService: {
        last4DigitsOfRadioId: string;
        vehicleInfo?: {
            year: number;
            make: string;
            model: string;
        };
    };
};

@Injectable({ providedIn: 'root' })
export class DataAccountVIPService {
    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, private readonly _store: Store) {}

    getAccountFromFlepzInfo(params: DataAccountVIPServiceParams, allowErrorHandler: boolean = true) {
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString(),
            },
        };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap((url) =>
                this._http.post<MicroservicesResponse<DataAccountVIPServiceResponse>>(`${url}${ENDPOINT_URL}`, params, options).pipe(
                    map((response) => {
                        return response.data;
                    })
                )
            )
        );
    }
}
