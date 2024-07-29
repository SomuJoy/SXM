import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';

const ENDPOINT_URL = '/authenticate/verify-phone';

export interface AuthenticationPhoneStatus {
    status: boolean;
}

@Injectable({ providedIn: 'root' })
export class VerifyPhoneService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    authenticationVerifyPhone(request: { phoneNumber: string }): Observable<AuthenticationPhoneStatus> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url => this._http.post<MicroservicesResponse<AuthenticationPhoneStatus>>(`${url}${ENDPOINT_URL}`, request, options)),
            map(response => response?.data || null)
        );
    }
}
