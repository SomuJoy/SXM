import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OAC_BASE_URL } from '@de-care/shared/configuration-tokens-oac';

@Injectable({ providedIn: 'root' })
export class FullBrowserRedirect {
    constructor(@Inject(DOCUMENT) private readonly _document: Document, @Inject(OAC_BASE_URL) private readonly _oacBaseUrl: string) {}

    performRedirect(url: string) {
        this._document.defaultView.location.href = url;
    }

    performRedirectToOac(urlSegment: string) {
        this.performRedirect(`${this._oacBaseUrl}${urlSegment}`);
    }

    performRedirectToOacAccountLogin() {
        this.performRedirectToOac('/login_view.action');
    }

    performRedirectToOacAccountLogoutLogin() {
        this.performRedirectToOac('/login_logout.action');
    }
}
