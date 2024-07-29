import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiPrefix } from '@de-care/settings';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { Store } from '@ngrx/store';
import { concatMap, map, take } from 'rxjs/operators';

const ENDPOINT_URL = '/check-eligibility/captcha';

export interface CheckOfferNucaptchaEligibilityData {
    status: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CheckOfferNucaptchaEligibilityService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    checkNuCaptchaEligibity(planCode: string) {
        const options = { withCredentials: true };
        return this._store.select(getApiPrefix).pipe(
            take(1),
            concatMap(url => this._http.post<MicroservicesResponse<CheckOfferNucaptchaEligibilityData>>(`${url}${ENDPOINT_URL}`, { planCode }, options)),
            map(response => response.data)
        );
    }
}
