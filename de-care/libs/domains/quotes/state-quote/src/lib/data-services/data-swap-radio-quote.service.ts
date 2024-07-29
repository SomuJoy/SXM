import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { QuoteModel } from './quote.interface';
import { Observable } from 'rxjs';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';

export interface SwapRadioQuoteRequestModel {
    selfPayRadioId: string;
    newRadioId: string;
}

interface Response {
    quote: QuoteModel;
}

type ActionErrorCodes = '';
type FieldErrorCodes = '';

const ENDPOINT_URL = '/quotes/swap-radio-quote';

@Injectable({ providedIn: 'root' })
export class DataSwapRadioQuoteService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    quote(request: SwapRadioQuoteRequestModel): Observable<Response> {
        const options = { withCredentials: true };
        return this._post<SwapRadioQuoteRequestModel, Response, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, request, options);
    }
}
