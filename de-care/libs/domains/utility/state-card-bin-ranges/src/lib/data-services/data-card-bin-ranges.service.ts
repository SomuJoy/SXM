import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { HttpClient } from '@angular/common/http';

const ENDPOINT_URL = '/utility/card-bin-ranges';

interface RequestModel {
    cardBinType: string | number;
}

interface ResponseModel {
    name: string;
    type: string;
    priority: number;
    regex: string;
}

type ActionErrorCodes = 'SYSTEM';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class DataCardBinRangesService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getCardBinRanges(payload: RequestModel = { cardBinType: -1 }): Observable<ResponseModel[]> {
        return this._post<RequestModel, ResponseModel[], ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true });
    }
}
