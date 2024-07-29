import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { getCheckoutRedirectionData } from '@de-care/de-care-use-cases/pick-a-plan/state-plan-selection-organic';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '@de-care/settings';
import { combineLatest } from 'rxjs';
import { getSelectedProvince } from '@de-care/domains/customer/state-locale';

@Injectable({ providedIn: 'root' })
export class PlanSelectionOrganicNavigationService {
    constructor(private _router: Router, private _store: Store, private _translateService: TranslateService, private _settingsService: SettingsService) {}

    goToCheckout() {
        combineLatest([this._store.pipe(select(getCheckoutRedirectionData)), this._store.pipe(select(getSelectedProvince))])
            .pipe(take(1))
            .subscribe(([data, province]) => {
                const langpref = this._settingsService.isCanadaMode && this._translateService.currentLang ? this._translateService.currentLang.split('-')[0] : undefined;
                this._router.navigate(['/subscribe/checkout/from-pick-a-plan-proactive'], {
                    queryParams: {
                        act: data.accountNumber,
                        radioId: data.radioId,
                        programCode: data.programCode,
                        selectedPackageName: data.selectedPackage,
                        promocode: data.promocode,
                        langpref,
                        province
                    }
                });
            });
    }
}
