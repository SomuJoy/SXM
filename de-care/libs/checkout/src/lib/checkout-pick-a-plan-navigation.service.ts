import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { concatMap, take } from 'rxjs/operators';
import { getLandingPageInboundUrlParams } from '@de-care/de-care-use-cases/checkout/state-checkout-triage';
import { EMPTY } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '@de-care/settings';

@Injectable({ providedIn: 'root' })
export class CheckoutPickAPlanNavigationService {
    constructor(private _router: Router, private _store: Store, private _translateService: TranslateService, private _settingsService: SettingsService) {}

    goToCheckout() {
        return this._store
            .pipe(
                select(getLandingPageInboundUrlParams),
                take(1),
                concatMap(({ programCode, radioId, accountNumber, lname, tkn, promocode }) => {
                    const langpref = this._settingsService.isCanadaMode && this._translateService.currentLang ? this._translateService.currentLang.split('-')[0] : undefined;
                    this._router.navigate(['subscribe', 'checkout', { proactiveFlow: true }], {
                        queryParams: { act: accountNumber, radioId, programCode, lname, tkn, promocode, langpref }
                    });
                    return EMPTY;
                })
            )
            .subscribe();
    }
}
