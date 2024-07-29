import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UpsellPackageModel } from './upsell-offer.interfaces';

export interface UpsellRequestData {
    planCode: string;
    radioId?: string;
    streaming?: boolean;
    subscriptionId?: string;
    upsellCode?: string;
    province?: string;
    retrieveFallbackOffer?: boolean;
}

export interface UpsellResponseData {
    offers: UpsellPackageModel[];
}

const ENDPOINT_URL = '/offers/upsell';

@Injectable({ providedIn: 'root' })
export class DataUpsellsService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getUpsellOffers(request: UpsellRequestData): Observable<UpsellPackageModel[]> {
        const options = { withCredentials: true };
        return this._post<UpsellRequestData, UpsellResponseData, null, null>(`${this._apiUrl}${ENDPOINT_URL}`, request, options).pipe(map((response) => response.offers));
    }
}
