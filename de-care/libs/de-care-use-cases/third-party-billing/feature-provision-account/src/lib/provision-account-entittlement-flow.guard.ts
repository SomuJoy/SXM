import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { UrlHelperService } from '@de-care/app-common';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProvisionAccountWorkflowService, ProvisionAccountRoutingService, setSelectedPartner } from '@de-care/de-care-use-cases/third-party-billing/state-provision-account';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class ProvisionAccountEntitlementFlowGuard implements CanActivate {
    translateRootKeyPrefix = 'deCareUseCasesThirdPartyBillingModule';
    constructor(
        private readonly _provisionAccountRoutingService: ProvisionAccountRoutingService,
        private readonly _urlHelperService: UrlHelperService,
        private readonly _provisionAccountWorkflowService: ProvisionAccountWorkflowService,
        private readonly _translateService: TranslateService,
        private readonly _store: Store
    ) {}
    canActivate(route: ActivatedRouteSnapshot) {
        const entitlementId = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'entitlementId');
        if (entitlementId) {
            return this._provisionAccountWorkflowService.build(entitlementId).pipe(
                map(data => {
                    const resellerCodeValue = this._translateService.instant(`${this.translateRootKeyPrefix}.${data.resellerCode}`);
                    const partnerName = resellerCodeValue.NAME || null;
                    this._store.dispatch(setSelectedPartner({ partnerName }));

                    if (!data.resellerCode || typeof resellerCodeValue === 'string') {
                        return this._provisionAccountRoutingService.entitlementErrorPageUrlTree();
                    }
                    if (data.isActive) {
                        return this._provisionAccountRoutingService.alreadyActivePageUrlTree();
                    }
                    return true;
                }),
                catchError(e => {
                    return of(this._provisionAccountRoutingService.entitlementErrorPageUrlTree());
                })
            );
        }
        this._provisionAccountRoutingService.goToEntitlementErrorPage();
        return of(false);
    }
}
