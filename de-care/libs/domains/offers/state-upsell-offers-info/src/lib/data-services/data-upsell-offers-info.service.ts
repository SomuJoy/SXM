import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface RequestData {
    leadOfferPlanCode: string;
    packageUpsellPlanCode?: string;
    termUpsellPlanCode?: string;
    packageAndTermUpsellPlanCode?: string;
    locales: string[];
    province?: string;
}
export interface ResponseData {
    locales: [{ locale: string; upsellOfferInfo: ResponseUpsellOfferModel }];
}
export interface ResponseUpsellOfferModel {
    packageUpsellOfferInfo: ResponseUpsellOfferPackageContentModel;
    termUpsellOfferInfo: ResponseUpsellOfferTermContentModel;
    packageAndTermUpsellOfferInfo: {
        packageUpsellOfferInfo: ResponseUpsellOfferPackageContentModel;
        termUpsellOfferInfo: ResponseUpsellOfferTermContentModel;
    };
}
export interface ResponseUpsellOfferPackageContentModel {
    header?: string;
    title?: string;
    description?: string;
    listeningOptions?: ListeningOn[];
    highlightsTitle?: string;
    highlightsText?: string[];
    showToggleLabel: string;
    hideToggleLabel: string;
    upsellDeals?: ResponseUpsellDealContentModel[];
}
export interface ResponseUpsellOfferTermContentModel {
    title?: string;
    description?: string;
    showToggleLabel: string;
    hideToggleLabel: string;
    upsellDeals?: ResponseUpsellDealContentModel[];
}
export type ListeningOn = 'Satellite' | 'Streaming' | 'Pandora';
export interface ResponseUpsellDealContentModel {
    name: string;
    header: string;
    deviceImage?: string;
}

const ENDPOINT_URL = '/offers/upsell/info';

@Injectable({ providedIn: 'root' })
export class DataUpsellOffersInfoService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getUpsellOffersInfo(request: RequestData): Observable<[{ locale: string; upsellOfferInfo: ResponseUpsellOfferModel }]> {
        const options = { withCredentials: true };
        return this._post<RequestData, ResponseData, null, null>(`${this._apiUrl}${ENDPOINT_URL}`, request, options).pipe(map((response) => response.locales));
    }
}
