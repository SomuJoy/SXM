import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '@de-care/settings';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MicroservicesResponse } from './microservice-response.interface';
import { Offer } from './offer.interface';

export interface OffersRequest {
    streaming: boolean;
    student?: boolean;
    programCode?: string;
    marketingPromoCode?: string;
    province?: string;
    retrieveFallbackOffer?: boolean;
}

export interface Sl2cOfferRequest {
    usedCarBrandingType: string;
}

export interface OfferRenewalRequestModel {
    radioId?: string;
    planCode?: string;
    renewalCode?: string;
    streaming: boolean;
}

export interface MarketingPromoCodeValidateResponse {
    status: string;
    promoCode: string;
}

const ENDPOINT_URLS = {
    OFFERS: '/offers',
    RENEWAL_OFFERS: '/offers/renewal',
    MARKETING_PROMO_CODE_VALIDATE: '/offers/promocode/validate',
};
@Injectable({ providedIn: 'root' })
export class DataOffersService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    getOffers(request: OffersRequest | Sl2cOfferRequest): Observable<Offer[]> {
        const options = { withCredentials: true };
        return this._http
            .post<MicroservicesResponse<{ offers: Offer[] }>>(`${this._url}${ENDPOINT_URLS.OFFERS}`, request, options)
            .pipe(map((response) => response.data.offers));
    }

    getOfferRenewal(offerRenewalData: OfferRenewalRequestModel): Observable<Offer[]> {
        const options = { withCredentials: true };

        return this._http.post<MicroservicesResponse<{ offers: Offer[] }>>(`${this._url}${ENDPOINT_URLS.RENEWAL_OFFERS}`, offerRenewalData, options).pipe(
            map((response) => {
                return response.data.offers;
            })
        );
    }

    validateMarketingPromoCode(request: { marketingPromoCode: string }): Observable<MarketingPromoCodeValidateResponse> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<MarketingPromoCodeValidateResponse>>(`${this._url}${ENDPOINT_URLS.MARKETING_PROMO_CODE_VALIDATE}`, request, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
