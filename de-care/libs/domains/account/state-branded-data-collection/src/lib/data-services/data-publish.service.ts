import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';

export interface DataPublishRequest {
    contextVariables: { name: string; value: string }[];
    message: string;
    botId: string;
    conversationId: string;
    userId: string;
}

export interface DataPublishResponse {
    code: number;
    data: boolean;
    error: boolean;
    message: string;
}

type ActionErrorCodes = '';
type FieldErrorCodes = '';

const ENDPOINT_URL = '/apigateway/branded-data-collection/publish';

@Injectable({ providedIn: 'root' })
export class DataPublishService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    publishData(request: DataPublishRequest): Observable<DataPublishResponse> {
        const options = { withCredentials: true };
        return this._post<DataPublishRequest, DataPublishResponse, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, request, options);
    }
}
