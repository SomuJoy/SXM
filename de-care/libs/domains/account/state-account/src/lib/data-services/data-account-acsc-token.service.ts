import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiPrefix } from '@de-care/settings';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { AccountFromAcscTokenModel } from './account-from-token.interface';
import { MicroservicesResponse } from './microservice-response.interface';
import { select, Store } from '@ngrx/store';

const ENDPOINT_URL = '/account/token/acsc';
@Injectable({ providedIn: 'root' })
export class DataAccountAcscTokenService {
    constructor(private _http: HttpClient, private _store: Store) {}
    getAccountFromToken(token: string): Observable<AccountFromAcscTokenModel> {
        const options = {
            withCredentials: true
        };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url => this._http.post<MicroservicesResponse<AccountFromAcscTokenModel>>(`${url}${ENDPOINT_URL}`, { token }, options)),
            map(response => response.data)
        );
    }
}
