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

export interface PrepaidRedeemResponse {
    amount: number;
    currency: string;
    cardNumber: number;
    giftCardExpYear: number;
    isSuccess: boolean;
}

@Injectable({ providedIn: 'root' })
export class AddPrepaidRedeemService {
    constructor(private _http: HttpClient, private _store: Store) {}

    redeemPrepaidCard(request: PrepaidRedeemRequest): Observable<PrepaidRedeemResponse> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url =>
                this._http.post<MicroservicesResponse<PrepaidRedeemResponse>>(`${url}${ENDPOINTS_CONSTANTS.PAYMENT_GIFTCARD_INFO}`, request, options).pipe(
                    map(response => {
                        return response.data;
                    })
                )
            )
        );
    }
}
