import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ALLOW_ERROR_HANDLER_HEADER, SettingsService } from '@de-care/settings';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MicroservicesResponse } from './microservice-response.interface';
import { Offer } from './offer.interface';

export interface OffersCustomerChangeRequest {
    streaming?: boolean;
    subscriptionId: number;
    province?: string;
    task?: string;
    marketingPromoCode?: string;
}

const ENDPOINT_URL = '/offers/customer/change';

@Injectable({ providedIn: 'root' })
export class DataChangeOffersService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    getCustomerChangeOffers(request: OffersCustomerChangeRequest, allowErrorHandler: boolean = true): Observable<Offer[]> {
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString(),
            },
        };
        return this._http.post<MicroservicesResponse<{ offers: Offer[] }>>(`${this._url}${ENDPOINT_URL}`, request, options).pipe(
            map((response) => {
                return response.data.offers;
            })
        );
    }
}
