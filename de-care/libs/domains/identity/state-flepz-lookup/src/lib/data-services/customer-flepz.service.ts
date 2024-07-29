import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { SubscriptionModel } from './models';

export interface CustomerFlepzRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    zipCode: string;
    prospectTrial?: boolean;
}

const ENDPOINT_URL = '/identity/customer/flepz';

@Injectable({ providedIn: 'root' })
export class CustomerFlepzService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    customerFlepz(request: CustomerFlepzRequest): Observable<SubscriptionModel[]> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url => this._http.post<MicroservicesResponse<SubscriptionModel[]>>(`${url}${ENDPOINT_URL}`, request, options).pipe(map(response => response.data)))
        );
    }
}
