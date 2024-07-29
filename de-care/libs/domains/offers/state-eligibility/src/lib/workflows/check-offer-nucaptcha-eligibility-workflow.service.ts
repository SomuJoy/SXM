import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { CheckOfferNucaptchaEligibilityService } from '../dataservices/check-offer-nucaptcha-eligibility.service';

@Injectable({
    providedIn: 'root'
})
export class CheckOfferNucaptchaEligibilityWorkflowService implements DataWorkflow<string, boolean> {
    constructor(private readonly _store: Store, private readonly _checkOfferNucaptchaEligibilityService: CheckOfferNucaptchaEligibilityService) {}

    build(planCode: string) {
        return this._checkOfferNucaptchaEligibilityService.checkNuCaptchaEligibity(planCode).pipe(map(response => response.status));
    }
}
