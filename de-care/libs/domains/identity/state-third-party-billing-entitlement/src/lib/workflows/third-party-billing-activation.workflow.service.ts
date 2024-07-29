import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { DataThirdPartyBillingEntitlementService } from '../data-services/data-third-party-billing-entitlement.service';
import { ThirdPartyBillingActivationRequestData } from '../data-services/third-party-billing-entitlement.model';

@Injectable({ providedIn: 'root' })
export class ThirdPartyBillingActivationWorkflowService implements DataWorkflow<ThirdPartyBillingActivationRequestData, boolean> {
    constructor(private readonly _dataThirdPartyBillingEntlitementService: DataThirdPartyBillingEntitlementService) {}

    build(thirdPartyBillingActivationRequestData: ThirdPartyBillingActivationRequestData) {
        return this._dataThirdPartyBillingEntlitementService.activateThirdPartySubscription(thirdPartyBillingActivationRequestData);
    }
}
