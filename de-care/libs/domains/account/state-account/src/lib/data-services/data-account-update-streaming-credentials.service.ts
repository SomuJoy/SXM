import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

export interface UpdateStreamingCredentialsRequest {
    radioId?: string;
    username?: string;
    password?: string;
    email?: string;
    synchronizeAccountEmail?: boolean;
}

export interface UpdateStreamingCredentialsResponse {
    status: string;
    httpStatusCode: number;
    httpStatus: string;
    data: [];
}

const ENDPOINT_URL = '/account/update-streaming';

@Injectable({ providedIn: 'root' })
export class DataAccountUpdateStreamingCredentialsService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    update(payload: UpdateStreamingCredentialsRequest): Observable<UpdateStreamingCredentialsResponse> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap((url) =>
                this._http.post<MicroservicesResponse<UpdateStreamingCredentialsResponse>>(`${url}${ENDPOINT_URL}`, payload, options).pipe(map((response) => response.data))
            )
        );
    }
}
