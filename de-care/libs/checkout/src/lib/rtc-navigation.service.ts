import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RtcNavigationService {
    constructor(private _router: Router) {}

    goToCheckout(act: string, radioId: string, programCode: string, renewalCode?: string) {
        this._router.navigate(['subscribe', 'checkout', { proactiveFlow: true }], { queryParams: { act, radioId, programCode, renewalCode } });
    }
}
