import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { UrlHelperService } from '@de-care/app-common';

@Injectable({
    providedIn: 'root'
})
export class ReturnUrlResolver implements Resolve<string> {
    constructor(private _urlHelper: UrlHelperService) {}

    resolve(route: ActivatedRouteSnapshot): string {
        const returnUrl = this._urlHelper.getCaseInsensitiveParam(route.queryParamMap, 'redirectUrl');
        return returnUrl || ''; // [TODO] Should we configure a default from environment settings?
    }
}
