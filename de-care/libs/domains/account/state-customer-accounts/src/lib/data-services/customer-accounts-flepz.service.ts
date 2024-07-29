import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiPrefix } from '@de-care/settings';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { CustomerAccountListAccount, CustomerAccountsListRequest } from './customer-accounts-list.interface';

const ENDPOINT_URL = '/identity/registration/flepz';

@Injectable({
    providedIn: 'root'
})
export class CustomerAccountFlepzService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    fetchCustomerAccounts(request: CustomerAccountsListRequest): Observable<CustomerAccountListAccount[]> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url => this._http.post<MicroservicesResponse<CustomerAccountListAccount[]>>(`${url}${ENDPOINT_URL}`, request, options)),
            map(response => response?.data || null)
        );
    }
}
