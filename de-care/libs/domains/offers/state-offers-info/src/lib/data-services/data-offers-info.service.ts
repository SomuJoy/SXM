import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';

export interface OffersInfoRequestData {
    planCodes: PlanCodeInfo[];
    locales: string[];
    province?: string;
}
export interface ResponseData {
    locales: ResponseOffersInfoLocaleModel[];
}
export interface ResponseOffersInfoLocaleModel {
    locale: string;
    offerInfos: ResponseOfferInfoModel[];
}
export interface ResponseOfferInfoModel {
    planCode: string;
    salesHero?: ResponseSalesHero;
    paymentInterstitialBullets?: string[];
    offerDescription: ResponseOfferDescription;
    offerDetails?: string;
    deals?: ResponseDeal[];
    addonHeaderOverride?: string;
    presentation: ResponsePresentation;
    numberOfBullets: number;
}
export interface ResponsePresentation {
    theme?: string;
    style?: string;
}
export interface ResponseSalesHero {
    title: string;
    subTitle: string;
    presentation: ResponsePresentation;
}
export interface ResponseOfferDescription {
    priceAndTermDescTitle: string;
    processingFeeDisclaimer?: string;
    packageName: string;
    highlightsTitle?: string;
    highlightsText: string[];
    listeningOptions: ListeningOn[];
    longDescription?: string;
    footer: string;
    packageFeatures: ResponseOfferDescriptionPackageFeature[];
    showToggleLabel: string;
    hideToggleLabel: string;
}
export interface ResponseOfferDescriptionPackageFeature {
    packageName: string;
    features: {
        name: string;
        tooltipText: string;
        shortDescription: string;
        learnMoreLinkText: string;
        learnMoreInformation: string;
    }[];
}
export interface ResponseDeal {
    description: string;
    deviceImage: string;
    productImage: string;
    header: string;
    name: string;
    title: string;
    addonShowToggleText: string;
    addonHideToggleText: string;
    presentation?: string;
}
export interface PlanCodeInfo {
    leadOfferPlanCode?: string;
    followOnPlanCode?: string;
    renewalPlanCodes?: string[];
}

export type ListeningOn = 'Satellite' | 'Streaming' | 'Pandora' | 'Perks';

const ENDPOINT_URL = '/offers/info';

@Injectable({ providedIn: 'root' })
export class DataOffersInfoService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getOffersInfo(request: OffersInfoRequestData): Observable<ResponseData> {
        const options = { withCredentials: true };
        return this._post<OffersInfoRequestData, ResponseData, null, null>(`${this._apiUrl}${ENDPOINT_URL}`, request, options);
    }
}
