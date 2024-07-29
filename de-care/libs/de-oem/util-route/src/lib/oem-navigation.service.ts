import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ERROR_ROUTE_SEGMENT, OEM_CHECKOUT_SEGMENT, MANAGE_ACCOUNT_SEGMENT } from './route-path.constants';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SettingsService } from '@de-care/settings';

@Injectable({ providedIn: 'root' })
export class OemNavigationService {
    private readonly _window: Window;
    constructor(@Inject(DOCUMENT) document: Document, private _cookieService: CookieService, private _settingService: SettingsService, private _router: Router) {
        this._window = document.defaultView;
    }

    goToErrorPage(langPref?: string): void {
        if (langPref) {
            //TODO Temp fix langPref sent only from CA, redirect to CA site error page if error occurred when processing token
            this._window.location.href = this._settingService.settings.caOemAppUrl + 'subscription-error';
        } else {
            this._router.navigate([`${OEM_CHECKOUT_SEGMENT}/${ERROR_ROUTE_SEGMENT}`]);
        }
    }

    goToManageAccount(): void {
        this._router.navigate([`${OEM_CHECKOUT_SEGMENT}/${MANAGE_ACCOUNT_SEGMENT}`]);
    }

    redirectToCAOemApp(langPref: string, _accessToken: string, _refreshToken: string, programCode: string): void {
        let caOemAppUrl = this._settingService.settings.caOemAppUrl + '?SXM_D_A=' + encodeURIComponent(_accessToken);
        if (_refreshToken) {
            caOemAppUrl = caOemAppUrl + '&SXM_D_R=' + encodeURIComponent(_refreshToken);
        }
        if (langPref) {
            caOemAppUrl = caOemAppUrl + '&langpref=' + langPref;
        }
        if (programCode) {
            caOemAppUrl = caOemAppUrl + '&programCode=' + programCode;
        }
        this._window.location.href = caOemAppUrl;
    }
}
