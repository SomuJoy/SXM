import { Injectable } from '@angular/core';
import { UrlHelperService } from '@de-care/app-common';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadCancelRequestWorkflowService } from '@de-care/de-care-use-cases/cancel-subscription/state-cancel-request';

@Injectable({ providedIn: 'root' })
export class CancelRequestFlowGuardService implements CanActivate {
    constructor(
        private readonly _router: Router,
        private readonly _urlHelperService: UrlHelperService,
        private readonly _loadCancelRequestWorkflowService: LoadCancelRequestWorkflowService
    ) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        const subscriptionId = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'subscriptionId');
        const accountNumber = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'accountNumber') || null;
        const iscancelonlineonly = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'cancelOnline') || null;
        return subscriptionId
            ? this._loadCancelRequestWorkflowService.build({ subscriptionId: +subscriptionId, accountNumber: accountNumber, cancelOnly: iscancelonlineonly === 'true' }).pipe(
                  catchError((error) => {
                      if (error?.errorCode === 'UNAUTHENTICATED_CUSTOMER') {
                          return this._loginRedirectStream();
                      } else {
                          return this._errorRedirectStream();
                      }
                  })
              )
            : this._errorRedirectStream();
    }

    private _errorRedirectStream(): Observable<UrlTree> {
        return of(this._router.createUrlTree(['/error']));
    }

    private _loginRedirectStream(): Observable<UrlTree> {
        return of(this._router.createUrlTree(['/account/login']));
    }
}
