import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import {
    AccountCredentialRecoveryFromValidateKeyLookupWorkflowService,
    getQueryParams,
    setResetTokenAccountData,
    setTokenValidity,
} from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { behaviorEventErrorFromBusinessLogic } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ResetPasswordCanActivateService implements CanActivate {
    constructor(
        private readonly _accountCredentialRecoveryFromValidateKeyLookupWorkflowService: AccountCredentialRecoveryFromValidateKeyLookupWorkflowService,
        private _store: Store,
        private _router: Router
    ) {}

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): any {
        const baseUrl = routerStateSnapshot.url.split(activatedRouteSnapshot.url[0].path)[0];
        return this._store.select(getQueryParams).pipe(
            take(1),
            concatMap(({ tkn, type, updatepwdtoken }) => {
                const token = tkn ? tkn : updatepwdtoken;
                return this._accountCredentialRecoveryFromValidateKeyLookupWorkflowService.build({ resetKey: token }).pipe(
                    tap((response) => {
                        if (response) {
                            this._store.dispatch(setResetTokenAccountData({ resetToken: token, tokenAccountType: type }));
                            return this._router.createUrlTree([`${baseUrl}reset-password`], { queryParams: activatedRouteSnapshot.queryParams });
                        } else {
                            return this._router.createUrlTree([`${baseUrl}forgot-password`]);
                        }
                    })
                );
            }),
            catchError(() => {
                this._store.dispatch(
                    behaviorEventErrorFromBusinessLogic({
                        message: 'Your password reset request has expired. Please submit another request.',
                        errorCode: 'INVALID_PASSWORD_RESET_TOKEN',
                    })
                );
                this._store.dispatch(setTokenValidity({ isTokenInvalid: true }));
                return of(this._router.createUrlTree([`${baseUrl}forgot-password`]));
            })
        );
    }
}
