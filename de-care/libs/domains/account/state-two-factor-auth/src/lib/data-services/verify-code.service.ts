import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiPrefix } from '@de-care/settings';
import { MicroservicesResponse } from '@de-care/shared/de-microservices-common';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, take } from 'rxjs/operators';
import { SendVerificationCodeRequest, VerifyCodeRequest, VerifyCodeResponse, VerifyCodeStatus, VerifyPhoneResponse } from './interfaces';

const SEND_CODE_ENDPOINT_URL = '/authenticate/verify-phone';
const VERIFY_CODE_ENDPOINT_URL = '/authenticate/verify-security-code';

@Injectable({
    providedIn: 'root'
})
export class VerifyCodeService {
    constructor(private _http: HttpClient, private readonly _store: Store) {}

    sendVerificationCode(request: SendVerificationCodeRequest): Observable<boolean> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url => this._http.post<MicroservicesResponse<VerifyPhoneResponse>>(`${url}${SEND_CODE_ENDPOINT_URL}`, request, options)),
            map(response => !!response?.data?.status)
        );
    }

    verifyCode(request: VerifyCodeRequest): Observable<VerifyCodeStatus> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url => this._http.post<MicroservicesResponse<VerifyCodeResponse>>(`${url}${VERIFY_CODE_ENDPOINT_URL}`, request, options)),
            map(response => (!!response?.data?.status ? VerifyCodeStatus.success : VerifyCodeStatus.incorrect)),
            catchError(err => {
                if (err.status === 400 && err.error?.error?.errorCode === 'MAX_VERIFICATION_ATTEMPTS_EXCEEDED') {
                    return of(VerifyCodeStatus.limitExceeded);
                }
                return of(VerifyCodeStatus.error);
            })
        );
    }
}
