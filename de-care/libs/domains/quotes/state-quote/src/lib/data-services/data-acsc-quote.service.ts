import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuoteModel } from './quote.interface';
import { MicroservicesResponse } from './microservice-response.interface';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

export interface ACSCQuoteRequestModel {
    transactionType: 'SERVICE_CONTINUITY' | 'SERVICE_PORTABILITY' | 'ACCOUNT_CONSOLIDATION';
    selfPayRadioId?: string;
    trialRadioId: string;
    followOnPlanCodes: string[];
    paymentType: 'invoice' | 'creditCard';
}

const ENDPOINT_URL = '/quotes/acsc-quote';

@Injectable({ providedIn: 'root' })
export class DataACSCQuoteService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    quote(request: ACSCQuoteRequestModel): Observable<QuoteModel> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap((url) => this._http.post<MicroservicesResponse<{ quote: QuoteModel }>>(`${url}${ENDPOINT_URL}`, request, options)),
            map((response) => {
                return response.data.quote;
            })
        );
    }
}
