import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

export interface AccountConsolidateRequest {
    trialRadioId: string;
}

const ENDPOINT_URL = '/trial-activation/account-consolidate';

@Injectable({ providedIn: 'root' })
export class DataAccountConsolidateService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    consolidate(request: AccountConsolidateRequest): Observable<any> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url => this._http.post<MicroservicesResponse<{ any }>>(`${url}${ENDPOINT_URL}`, request, options)),
            map(response => response.data)
        );
    }
}
