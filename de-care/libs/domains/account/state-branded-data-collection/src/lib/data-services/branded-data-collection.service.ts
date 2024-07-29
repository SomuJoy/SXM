import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';

export interface BrandedDataCollectionRequest {
    token: string;
    tokenType: string;
}

export interface BrandedDataCollectionResponse {
    formType: string;
    displayFields: string[];
    botId: string;
    conversationId: string;
    userId: string;
}

type ActionErrorCodes = '';
type FieldErrorCodes = '';

const ENDPOINT_URL = '/account/token/branded-data-collection';

@Injectable({ providedIn: 'root' })
export class BrandedDataCollectionService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    brandedDataCollection(request: BrandedDataCollectionRequest): Observable<BrandedDataCollectionResponse> {
        const options = { withCredentials: true };
        return this._post<BrandedDataCollectionRequest, BrandedDataCollectionResponse, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, request, options);
    }
}
