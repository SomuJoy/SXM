import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { setProgramCode, setMarketingPromoCode } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { Injectable } from '@angular/core';
import { UrlHelperService } from '@de-care/app-common';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ACSCProgramcodeResolverService implements Resolve<null> {
    constructor(private readonly _store: Store<any>, private readonly _urlHelperService: UrlHelperService) {}

    resolve(route: ActivatedRouteSnapshot) {
        const programCode = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'programcode');
        const promoCode = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'promocode');

        if (!!programCode) {
            this._store.dispatch(setProgramCode({ programCode }));
        } else if (!!promoCode) {
            this._store.dispatch(setMarketingPromoCode({ marketingPromoCode: promoCode }));
        }
        return of(null);
    }
}
