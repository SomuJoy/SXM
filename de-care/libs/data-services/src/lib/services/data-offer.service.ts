import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MicroservicesResponse } from '../models/microservices-response.model';
import { Locales, OfferCustomerDataModel, OfferModel, PackageDescriptionModel, OfferRequestModel, OfferRenewalRequestModel, PackageModel } from '../models/offer.model';
import { SettingsService, ALLOW_ERROR_HANDLER_HEADER } from '@de-care/settings';
import { ENDPOINTS_CONSTANTS } from '../configs/endpoints.constants';
import { PromoCodeValidateResponse } from './data-validation.service';
import { UpsellPackageModel, UpsellRequestData, UpsellResponseData } from '../interfaces/request-data.interface';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class DataOfferService {
    private url: string;

    constructor(private _http: HttpClient, private _env: SettingsService, private readonly _store: Store) {
        this.url = `${this._env.settings.apiUrl}${this._env.settings.apiPath}`;
    }

    /**
     * @deprecated use DataOffersService in domain @de-care/domains/offers/state-offers instead
     */
    getOffer(offerRequest: OfferRequestModel): Observable<OfferModel> {
        const options = {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return this._http.post<MicroservicesResponse<OfferModel>>(`${this.url}${ENDPOINTS_CONSTANTS.OFFERS}`, offerRequest, options).pipe(map(response => response.data));
    }

    getOfferRenewal(offerRenewalData: OfferRenewalRequestModel): Observable<PackageModel[]> {
        const options = { withCredentials: true };

        return this._http.post<MicroservicesResponse<OfferModel>>(`${this.url}${ENDPOINTS_CONSTANTS.OFFERS_RENEWAL}`, offerRenewalData, options).pipe(
            map(response => {
                return response.data.offers;
            })
        );
    }

    /**
     * @deprecated use DataOffersService in domain @de-care/domains/offers/state-offers instead
     */
    customer(offerCustomerData: OfferCustomerDataModel): Observable<OfferModel> {
        const options = { withCredentials: true };
        return this._http
            .post<MicroservicesResponse<OfferModel>>(`${this.url}${ENDPOINTS_CONSTANTS.OFFERS_CUSTOMER}`, offerCustomerData, options)
            .pipe(map(response => response.data));
    }

    /**
     * @deprecated Use workflows/actions from @de-care/domains/offers/state-package-descriptions
     */
    allPackageDescriptions(params: { locale: Locales; oemDevice: boolean }): Observable<PackageDescriptionModel[]> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<any>>(`${this.url}${ENDPOINTS_CONSTANTS.OFFERS_ALL_PACKAGE_DESC}`, params, options).pipe(
            map(response => {
                return response.data.packagesDescription;
            })
        );
    }

    /**
     * @deprecated Use workflows from @de-care/domains/offers/state-promo-code
     */
    validatePromoCode(payload: { marketingPromoCode: string }, allowErrorHandler: boolean = true): Observable<PromoCodeValidateResponse> {
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString()
            }
        };
        return this._http.post<MicroservicesResponse<any>>(`${this.url}${ENDPOINTS_CONSTANTS.OFFERS_PROMOCODE_VALIDATE}`, payload, options).pipe(
            map(response => {
                return response.data;
            })
        );
    }

    /**
     * @deprecated Use LoadUpsellOffersWorkflowService from @de-care/domains/offers/state-upsells
     */
    getUpsellOffers(payload: UpsellRequestData): Observable<UpsellPackageModel[]> {
        const options = { withCredentials: true };
        return this._http
            .post<MicroservicesResponse<UpsellResponseData>>(`${this.url}${ENDPOINTS_CONSTANTS.OFFERS_UPSELL}`, payload, options)
            .pipe(map(response => response.data.offers));
    }

    decideOffer(isStudent: boolean, payload: OfferRequestModel | OfferCustomerDataModel): Observable<OfferModel> {
        return isStudent ? this.customer(payload) : this.getOffer(payload);
    }

    getPlanCode(offer: OfferModel): string {
        return offer && offer.offers && Array.isArray(offer.offers) ? offer.offers[0].planCode : null;
    }
}
