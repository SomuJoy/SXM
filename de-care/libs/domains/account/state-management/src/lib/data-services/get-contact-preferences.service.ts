import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';

export interface GetContactPreferencesRequest {
    langPref: string;
}

export interface GetContactPreferencesResponse {
    encryptedXmlPayload: string;
    generatedUrl: string;
}

type ActionErrorCodes = '';
type FieldErrorCodes = '';
const ENDPOINT_URL = '/account-mgmt/contact-preferences';

@Injectable({ providedIn: 'root' })
export class GetContactPreferencesService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    build(request: GetContactPreferencesRequest): Observable<GetContactPreferencesResponse> {
        const options = { withCredentials: true };
        return this._post<GetContactPreferencesRequest, GetContactPreferencesResponse, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, request, options);
    }
}
