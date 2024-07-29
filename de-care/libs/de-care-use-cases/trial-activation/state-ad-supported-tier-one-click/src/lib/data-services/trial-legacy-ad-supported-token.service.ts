import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MicroservicesResponse } from './microservice-response.interface';
import { DetokenizeResponse } from './detokenize-response.interface';
import { select, Store } from '@ngrx/store';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { map, switchMap, take } from 'rxjs/operators';

const ENDPOINT_URL = '/trial-activation/last-one-click';

@Injectable({
    providedIn: 'root'
})
export class TrialLegacyAdSupportedTokenService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    detokenize(token: string) {
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            switchMap(url => this._http.post<MicroservicesResponse<DetokenizeResponse>>(`${url}${ENDPOINT_URL}`, { token }, { withCredentials: true })),
            map(response => {
                return response.data;
            })
        );
    }
}
