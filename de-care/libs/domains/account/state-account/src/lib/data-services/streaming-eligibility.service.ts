import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

const ENDPOINT_URL = '/account/streaming-eligibility';

export interface StreamingEligibilityServiceRequest {
    accountNumber?: string;
    radioId?: string;
}

export interface StreamingEligibilityServiceResponse {
    statusCode: boolean;
    isEligible: boolean;
    hasOACCredentials: boolean;
    eligibleSubscriptionId?: string;
    ineligibleReasonCodes?: string[];
    eligibleService?: 'SXIR_STANDALONE' | 'SXIR_LINKED';
    deviceToken?: string;
}

@Injectable({ providedIn: 'root' })
export class StreamingEligibilityService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    isStreamingEligible(request: StreamingEligibilityServiceRequest): Observable<StreamingEligibilityServiceResponse> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap((url) =>
                this._http.post<MicroservicesResponse<StreamingEligibilityServiceResponse>>(`${url}${ENDPOINT_URL}`, request, options).pipe(map((response) => response.data))
            )
        );
    }
}
