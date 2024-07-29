import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getCheckoutRedirectionData } from '@de-care/de-care-use-cases/roll-to-choice/state-plan-choice-organic';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PlanChoiceOrganicNavigationService {
    constructor(private _router: Router, private _store: Store) {}

    goToCheckout() {
        this._store.pipe(select(getCheckoutRedirectionData), take(1)).subscribe((data) => {
            this._router.navigate(['/subscribe/checkout/from-rtc-proactive'], {
                queryParams: {
                    act: data.accountNumber,
                    radioId: data.radioId,
                    programCode: data.programCode,
                    renewalCode: data.renewalCode,
                    selectedRenewalPackageName: data.selectedPackage,
                },
            });
        });
    }
}
