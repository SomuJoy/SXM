import { Component, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getEntitlementErrorData, ProvisionAccountRoutingService } from '@de-care/de-care-use-cases/third-party-billing/state-provision-account';
import { map, tap } from 'rxjs/operators';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { TranslateService } from '@ngx-translate/core';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';

@Component({
    selector: 'de-care-entitlement-error',
    templateUrl: './entitlement-error.component.html',
    styleUrls: ['./entitlement-error.component.scss']
})
export class EntitlementErrorComponent implements AfterViewInit {
    translateKeyPrefix = 'deCareUseCasesThirdPartyBillingModule.entitlementErrorComponent';
    entitlementErrorData$ = this._store.pipe(select(getEntitlementErrorData)).pipe(
        tap(entitlementErrorData => {
            this.pageTracking(!entitlementErrorData.entitlementId);
        }),
        map(value => {
            const resellerCodeValue = this._translateService.instant('deCareUseCasesThirdPartyBillingModule.' + value.resellerCode);
            return {
                ...value,
                partnerName: typeof resellerCodeValue === 'string' ? null : resellerCodeValue.NAME
            };
        })
    );

    constructor(
        private readonly _store: Store,
        private readonly _provisionAccountRoutingService: ProvisionAccountRoutingService,
        private readonly _translateService: TranslateService
    ) {}

    ngAfterViewInit() {
        this._store.dispatch(pageDataFinishedLoading());
    }

    fireBackButton() {
        this._provisionAccountRoutingService.backToEntitlementMainRoute();
    }

    private pageTracking(isEntitlementValidationError: boolean) {
        const componentKey = isEntitlementValidationError ? 'TPBentitlementIDInvalid' : 'TPBaccountSetupFailed';
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'thirdpartybilling', componentKey }));
    }
}
