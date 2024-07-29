import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { catchError, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
    LoadAccountFromSsoWorkflowService,
    LoadAccountFromSsoWorkflowServiceError,
    LoadQuoteReactivationWorkflowService,
} from '@de-care/de-care-use-cases/account/state-my-account';
import { FullBrowserRedirect } from '@de-care/shared/browser-common/util-redirect';

@Injectable({ providedIn: 'root' })
export class LoadAccountCanActivateService implements CanActivate {
    constructor(
        private readonly _router: Router,
        private readonly _LoadAccountFromSsoWorkflowService: LoadAccountFromSsoWorkflowService,
        private readonly _fullBrowserRedirect: FullBrowserRedirect,
        private readonly _loadQuoteReactivationWorkflowService: LoadQuoteReactivationWorkflowService
    ) {}

    canActivate() {
        return this._LoadAccountFromSsoWorkflowService.build().pipe(
            concatMap(() => this._loadQuoteReactivationWorkflowService.build()),
            catchError((error: LoadAccountFromSsoWorkflowServiceError) => {
                if (error === 'NOT_AUTHENTICATED') {
                    return of(this._router.createUrlTree(['account/login']));
                } else if (error === 'SECURITY_LEVEL_LOW' || error === 'ACCOUNT_NOT_REGISTERED') {
                    return of(this._router.createUrlTree(['/account/registration/step-up']));
                }
                return of(this._router.createUrlTree(['error']));
            })
        );
    }
}
