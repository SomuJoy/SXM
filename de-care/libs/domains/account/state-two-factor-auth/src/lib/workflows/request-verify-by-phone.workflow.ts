import { VerifyCodeService } from './../data-services/verify-code.service';
import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { SendVerificationCodeRequest } from '../data-services/interfaces';
import { catchError, map, tap } from 'rxjs/operators';
import { setPhoneVerificationRequestCodeStatus } from '../state/actions';

export enum RequestVerifyByPhoneStatus {
    success = 'success',
    failure = 'failure',
    error = 'error',
    limitExceeded = 'limitExceeded'
}

@Injectable({ providedIn: 'root' })
export class RequestVerifyByPhoneWorkflow implements DataWorkflow<SendVerificationCodeRequest, RequestVerifyByPhoneStatus> {
    constructor(private readonly _store: Store, private readonly _verifyCodeService: VerifyCodeService) {}

    build(request: SendVerificationCodeRequest): Observable<RequestVerifyByPhoneStatus> {
        return this._verifyCodeService.sendVerificationCode(request).pipe(
            map(status => (status ? RequestVerifyByPhoneStatus.success : RequestVerifyByPhoneStatus.failure)),
            tap(status => this._store.dispatch(setPhoneVerificationRequestCodeStatus({ status }))),
            catchError(err => {
                console.log(err);
                if (err.error?.httpStatusCode === 400 && err.error?.error?.errorCode === 'MAX_RESEND_ATTEMPTS_EXCEEDED') {
                    return of(RequestVerifyByPhoneStatus.limitExceeded);
                }
                return of(RequestVerifyByPhoneStatus.error);
            })
        );
    }
}
