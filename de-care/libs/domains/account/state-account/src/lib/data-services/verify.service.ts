import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { concatMap, map, take } from 'rxjs/operators';

const ENDPOINT_URL = '/account/verify';

interface Request {
    lastName: string;
    phoneNumber: string;
    zipCode: string;
}

@Injectable({ providedIn: 'root' })
export class VerifyService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    verify(request: Request) {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url => this._http.post<MicroservicesResponse<boolean>>(`${url}${ENDPOINT_URL}`, request, options).pipe(map(response => response.data)))
        );
    }
}
