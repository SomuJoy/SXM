import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

const ENDPOINT_URL = '/account/auth-verify-options';

interface RegisterVerifyOptionsRequest {
    accountNumber: string;
}

interface RegisterVerifyOptionsResponse {
    maskedPhoneNumber?: string;
    canUsePhone: boolean;
    canUseRadioId: boolean;
    canUseAccountNumber: boolean;
    canUseEmail: boolean;
}

@Injectable({ providedIn: 'root' })
export class RegisterVerifyOptionsService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    getVerifyOptions(request: RegisterVerifyOptionsRequest): Observable<RegisterVerifyOptionsResponse> {
        const options = { withCredentials: true };

        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap((url) =>
                this._http.post<MicroservicesResponse<RegisterVerifyOptionsResponse>>(`${url}${ENDPOINT_URL}`, request, options).pipe(
                    map((response) => {
                        return response.data;
                    })
                )
            )
        );
    }
}
