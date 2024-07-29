import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

const ENDPOINT_URL = '/account/token/streaming';

export interface StreamingTokenDataServiceRequest {
    token: string;
}

export interface StreamingTokenDataServiceResponse {
    hasValidAddress: boolean;
    maskedUserName: string;
    hasAccount: boolean;
}

@Injectable({ providedIn: 'root' })
export class StreamingTokenDataService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    getStreamingTokenData(request: StreamingTokenDataServiceRequest): Observable<StreamingTokenDataServiceResponse> {
        const options = { withCredentials: true };

        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url =>
                this._http.post<MicroservicesResponse<StreamingTokenDataServiceResponse>>(`${url}${ENDPOINT_URL}`, request, options).pipe(map(response => response.data))
            )
        );
    }
}
