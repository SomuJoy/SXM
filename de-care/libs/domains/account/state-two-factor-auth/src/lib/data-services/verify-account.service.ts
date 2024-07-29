import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';

const ENDPOINT_URL = '/authenticate/verify-pii-data';

export enum AccountVerificationStatusEnum {
    'valid' = 'valid',
    'invalid' = 'invalid'
}

export interface AccountVerificationStatus {
    status: AccountVerificationStatusEnum;
}

export interface LPZVerificationRequest {
    lastName: string;
    phoneNumber: string;
    zipCode: string;
}

export interface AccountVerificationRequest {
    accountNumber?: string;
    radioId?: string;
    lpzVerificationRequest?: LPZVerificationRequest;
}

@Injectable({ providedIn: 'root' })
export class VerifyAccountService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    authenticationVerifyAccount(request: AccountVerificationRequest): Observable<AccountVerificationStatus> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url => this._http.post<MicroservicesResponse<AccountVerificationStatus>>(`${url}${ENDPOINT_URL}`, request, options)),
            map(response => (response?.data?.status ? { status: AccountVerificationStatusEnum.valid } : { status: AccountVerificationStatusEnum.invalid } || null))
        );
    }
}
