import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsService } from '@de-care/settings';
import { ENDPOINTS_CONSTANTS } from './constants';

export interface FollowOnRequestModel {
    streaming: boolean;
    subscriptionId?: number;
    radioId?: number;
    province?: string;
    planCode: string;
    renewalCode?: string;
}

interface MicroservicesResponse<T> {
    data: T;
}

export interface FollowOnOffersModel {
    // TODO: add more domain specific interface(s) for this model
    offers: any[];
}

@Injectable({ providedIn: 'root' })
export class DataFollowOnOffersService {
    private url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this.url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    getFollowOnOffer(followOnOfferRequest: FollowOnRequestModel): Observable<FollowOnOffersModel> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<FollowOnOffersModel>>(`${this.url}${ENDPOINTS_CONSTANTS.OFFERS_FOLLOW_ON}`, followOnOfferRequest, options).pipe(
            map(response => {
                return response.data;
            })
        );
    }
}
