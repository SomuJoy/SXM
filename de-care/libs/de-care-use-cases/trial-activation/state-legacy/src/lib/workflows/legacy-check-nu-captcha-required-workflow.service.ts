import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { CheckOfferNucaptchaEligibilityWorkflowService } from '@de-care/domains/offers/state-eligibility';

@Injectable({
    providedIn: 'root'
})
export class LegacyCheckNucaptchaRequiredWorkflowService implements DataWorkflow<string, boolean> {
    constructor(private readonly _checkOfferNucaptchaEligibilityWorkflowService: CheckOfferNucaptchaEligibilityWorkflowService) {}

    build(planCode: string) {
        return this._checkOfferNucaptchaEligibilityWorkflowService.build(planCode);
    }
}
