import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Offer } from './offer.interface';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

export interface OffersRequest {
    trialRadioId: string;
    selfPayRadioId?: string;
    accountConsolidation: boolean;
}

const ENDPOINT_URL = '/offers/customer/acsc';

@Injectable({ providedIn: 'root' })
export class DataACSCOffersService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    getOffers(request: OffersRequest): Observable<Offer[]> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap((url) => {
                return this._http.post<MicroservicesResponse<{ offers: Offer[] }>>(`${url}${ENDPOINT_URL}`, request, options);
            }),
            map((response) => response.data.offers)
        );
    }
}
