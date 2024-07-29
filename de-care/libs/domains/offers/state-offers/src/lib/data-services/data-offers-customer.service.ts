import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '@de-care/settings';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MicroservicesResponse } from './microservice-response.interface';
import { Offer } from './offer.interface';

export interface OffersCustomerRequest {
    streaming: boolean;
    subscriptionId?: number;
    student?: boolean;
    programCode?: string;
    marketingPromoCode?: string;
    redemptionType?: string;
    province?: string;
    radioId?: string;
    plans?: {
        code: string;
        packageName?: string;
    }[];
    retrieveFallbackOffer?: boolean;
}

export interface OffersCustomerWithBrandingAndRadioIdRequest {
    usedCarBrandingType?: string;
    radioId: string;
}

const ENDPOINT_URL = '/offers/customer';

@Injectable({ providedIn: 'root' })
export class DataOffersCustomerService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    getCustomerOffers(request: OffersCustomerRequest | OffersCustomerWithBrandingAndRadioIdRequest): Observable<Offer[]> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<{ offers: Offer[] }>>(`${this._url}${ENDPOINT_URL}`, request, options).pipe(map((response) => response.data.offers));
    }
}
