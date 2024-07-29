import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINTS_CONSTANTS } from '@de-care/data-services';
import { getApiPrefix } from '@de-care/settings';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

export interface PrepaidRedeemRequest {
    giftCardNumber: string;
    giftCardExpMonth?: string;
    giftCardExpYear?: string;
    securityCode?: string;
}

@Injectable({ providedIn: 'root' })
export class RemovePrepaidRedeemService {
    constructor(private _http: HttpClient, private _store: Store) {}

    removePrepaidCard(): Observable<any> {
        const requestBody: Object = undefined;
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url =>
                this._http.post<MicroservicesResponse<string>>(`${url}${ENDPOINTS_CONSTANTS.PAYMENT_GIFTCARD_REMOVE}`, requestBody, options).pipe(
                    map(response => {
                        return response.data;
                    })
                )
            )
        );
    }
}
