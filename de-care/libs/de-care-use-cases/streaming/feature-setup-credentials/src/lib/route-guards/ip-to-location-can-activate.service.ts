import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { GetCountryCodeFromCurrentIpLocationWorkflowService } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IpToLocationCanActivateService implements CanActivate {
    private readonly _window: Window;

    constructor(
        private readonly _router: Router,
        private readonly _getCountryCodeFromCurrentIpLocationWorkflowService: GetCountryCodeFromCurrentIpLocationWorkflowService,
        @Inject(DOCUMENT) private readonly _document: Document
    ) {
        this._window = this._document && this._document.defaultView;
    }

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<any | UrlTree> {
        return this._getCountryCodeFromCurrentIpLocationWorkflowService.build().pipe(
            map((data) => {
                if (data) {
                    this._window.location.href = this._window.location.href.replace(this._window.location.origin, 'http://care.siriusxm.ca');
                } else {
                    return of(this._router.navigate(['onboarding/activate-device-min'], { queryParams: activatedRouteSnapshot.queryParams }));
                }
            })
        );
    }
}
