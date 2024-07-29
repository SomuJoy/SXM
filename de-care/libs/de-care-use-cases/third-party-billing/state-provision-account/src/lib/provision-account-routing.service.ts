import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { selectEntitlementId } from './state/selectors';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProvisionAccountRoutingService {
    constructor(private readonly _router: Router, private readonly _store: Store) {}

    alreadyActivePageUrlTree() {
        return this._router.createUrlTree(['/subscribe/entitlement/already-active']);
    }

    goToEntitlementErrorPage() {
        this._router.navigate(['/subscribe/entitlement/error']);
    }

    entitlementErrorPageUrlTree() {
        return this._router.createUrlTree(['/subscribe/entitlement/error']);
    }

    backToEntitlementMainRoute() {
        this._store.pipe(select(selectEntitlementId), take(1)).subscribe({
            next: entitlementId =>
                this._router.navigate(['/subscribe/entitlement'], {
                    queryParams: {
                        entitlementId
                    }
                })
        });
    }
}
