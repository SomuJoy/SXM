import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { areConfirmationPageParamsValid } from '@de-care/de-care-use-cases/trial-activation/state-ad-supported-tier-one-click';
import { select, Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';

@Injectable()
export class AdSupportedTierOneClickConfirmationCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _store: Store) {}

    canActivate() {
        return this._store.pipe(
            select(areConfirmationPageParamsValid),
            take(1),
            map(paramsAreValid => {
                if (paramsAreValid) {
                    return true;
                }
                return this._router.createUrlTree(['/error']);
            })
        );
    }
}
