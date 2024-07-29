import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { concatMap, map, take } from 'rxjs/operators';
import { MicroservicesResponse } from './microservice-response.interface';

const ENDPOINT_URL = '/validate/email';

export interface ValidateEmailRequestInterface {
    email: string;
}

export interface ValidateEmailResponseInterface {
    email: string;
    suggestedEmail: string;
    message: string;
    resultCode: string;
    errorCode: string;
    errorMessage: string;
    responseCode: string;
    verificationStatus: 'VALID' | 'INVALID';
    verificationMessage: string;
    valid: boolean;
}

@Injectable({ providedIn: 'root' })
export class ValidateEmailService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    submit(customerInfo: ValidateEmailRequestInterface) {
        const options = {
            withCredentials: true,
            headers: {
                'X-Allow-Error-Handler': 'true',
            },
        };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap((url) => this._http.post<MicroservicesResponse<ValidateEmailResponseInterface>>(`${url}${ENDPOINT_URL}`, { email: customerInfo.email }, options)),
            map((response) => response?.data?.valid || false)
        );
    }
}
