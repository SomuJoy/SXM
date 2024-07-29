import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { setSecurityCodeVerificationCompleted } from '../state/actions';
import { VerifyCodeService } from '../data-services/verify-code.service';
import { VerifyCodeStatus } from '../data-services/interfaces';

@Injectable({ providedIn: 'root' })
export class SubmitVerifyCodeWorkflow implements DataWorkflow<number, VerifyCodeStatus> {
    constructor(private readonly _store: Store, private readonly _verifyCodeService: VerifyCodeService) {}

    build(securityCode: number): Observable<VerifyCodeStatus> {
        return this._verifyCodeService.verifyCode({ securityCode }).pipe(tap(() => this._store.dispatch(setSecurityCodeVerificationCompleted())));
    }
}
