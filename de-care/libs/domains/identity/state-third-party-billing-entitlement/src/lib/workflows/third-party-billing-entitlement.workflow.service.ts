import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { DataThirdPartyBillingEntitlementService } from '../data-services/data-third-party-billing-entitlement.service';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { ThirdPatyBillingEntitlementData } from '../data-services/third-party-billing-entitlement.model';

@Injectable({ providedIn: 'root' })
export class ThirdPartyBillingEntitlementWorkflowService implements DataWorkflow<string, ThirdPatyBillingEntitlementData> {
    constructor(private readonly _dataThirdPartyBillingEntlitementService: DataThirdPartyBillingEntitlementService, private readonly _store: Store) {}

    build(entitlementId: string) {
        return this._dataThirdPartyBillingEntlitementService.getEntitlement(entitlementId);
    }
}
