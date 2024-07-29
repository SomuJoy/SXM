import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';

const ENDPOINT_URL = '/authenticate/verify-pii-data';

export enum RadioIdVerificationStatusEnum {
    'valid' = 'valid',
    'invalid' = 'invalid',
    'fail' = 'fail'
}

export interface RadioIdVerificationStatus {
    status: RadioIdVerificationStatusEnum;
}

@Injectable({ providedIn: 'root' })
export class VerifyRadioIdService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    authenticationVerifyRadioId(request: { radioId: string }): Observable<RadioIdVerificationStatus> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url => this._http.post<MicroservicesResponse<RadioIdVerificationStatus>>(`${url}${ENDPOINT_URL}`, request, options)),
            map(response => (response?.data.status ? { status: RadioIdVerificationStatusEnum.valid } : { status: RadioIdVerificationStatusEnum.invalid } || null))
        );
    }
}
