import { HttpClient } from '@angular/common/http';
import { take, map, switchMap, tap } from 'rxjs/operators';
import { getApiPrefix } from '@de-care/settings';
import { Store, select } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { MicroservicesResponse } from './microservice-response.interface';
import { UserNameValidateResponse, UserNameValidatePayload } from './customer-validation.interface';

const ENDPOINT_URL = '/validate/unique-login';

@Injectable({
    providedIn: 'root',
})
export class UserNameValidationService {
    constructor(private readonly _store: Store, private readonly _http: HttpClient) {}

    validateUserName(payload: UserNameValidatePayload) {
        const options = {
            withCredentials: true,
        };

        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            switchMap((url) => this._http.post<MicroservicesResponse<UserNameValidateResponse>>(`${url}${ENDPOINT_URL}`, payload, options)),
            map((response) => response.data)
        );
    }
}
