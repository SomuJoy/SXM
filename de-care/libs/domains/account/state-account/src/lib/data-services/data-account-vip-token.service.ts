import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService, ALLOW_ERROR_HANDLER_HEADER } from '@de-care/settings';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { Account } from './account.interface';

const ENDPOINT_URL = '/account/token/upgrade-vip';

type DataAccountVIPTokenServiceResponse = {
    nonPIIAccount: Account;
    eligibleSecondarySubscriptions: DataAccountVipTokenEligibleSubscription[];
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

type DataAccountVipTokenEligibleSubscription = {
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
export class DataAccountVIPTokenService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    getAccountFromToken(
        token: string,
        isStreaming: boolean = false,
        student: boolean = false,
        allowErrorHandler: boolean = true
    ): Observable<DataAccountVIPTokenServiceResponse> {
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString(),
            },
        };
        return this._http
            .post<MicroservicesResponse<DataAccountVIPTokenServiceResponse>>(
                `${this._url}${ENDPOINT_URL}`,
                { token, tokenType: isStreaming ? 'SALES_STREAMING' : 'SALES_AUDIO', student },
                options
            )
            .pipe(
                map((response) => {
                    return response.data;
                })
            );
    }
}
