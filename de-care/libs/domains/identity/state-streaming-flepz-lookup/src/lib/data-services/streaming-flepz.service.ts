import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { AccountModel } from './models';

export interface StreamingFlepzRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    zipCode: string;
    prospectTrial?: boolean;
}

const ENDPOINT_URL = '/identity/streaming/flepz';

@Injectable({ providedIn: 'root' })
export class StreamingFlepzService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    customerFlepz(request: StreamingFlepzRequest): Observable<AccountModel[]> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url => this._http.post<MicroservicesResponse<AccountModel[]>>(`${url}${ENDPOINT_URL}`, request, options).pipe(map(response => response.data)))
        );
    }
}
