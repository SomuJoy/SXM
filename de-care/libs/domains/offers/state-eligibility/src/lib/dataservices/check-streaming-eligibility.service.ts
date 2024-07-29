import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';

const ENDPOINT_URL = '/check-eligibility/streaming';

export interface OfferCheckEligibilityStreamingRequestModel {
    planCode: string;
    firstName: string;
    lastName: string;
    email: string;
    zipCode: string | number;
    creditCardNumber?: string | number;
}

export interface OfferCheckEligibilityStreamingResponseModel {
    isEligible: boolean;
    eligibilityCheckExecuted: boolean;
}

@Injectable({ providedIn: 'root' })
export class CheckStreamingEligibilityService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    checkEligibility(request: OfferCheckEligibilityStreamingRequestModel): Observable<OfferCheckEligibilityStreamingResponseModel> {
        const options = { withCredentials: true };
        return this._store.select(getApiPrefix).pipe(
            take(1),
            concatMap(url => this._http.post<MicroservicesResponse<OfferCheckEligibilityStreamingResponseModel>>(`${url}${ENDPOINT_URL}`, request, options)),
            map(response => response.data)
        );
    }
}
