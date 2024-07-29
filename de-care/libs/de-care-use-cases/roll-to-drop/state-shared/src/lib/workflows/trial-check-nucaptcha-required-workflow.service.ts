import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { CheckOfferNucaptchaEligibilityWorkflowService } from '@de-care/domains/offers/state-eligibility';
import { tap } from 'rxjs/operators';
import { setDisplayNuCaptcha } from '../state/actions';

@Injectable({
    providedIn: 'root'
})
export class TrialCheckNucaptchaRequiredWorkflowService implements DataWorkflow<string, boolean> {
    constructor(private readonly _store: Store, private readonly _checkOfferNucaptchaEligibilityWorkflowService: CheckOfferNucaptchaEligibilityWorkflowService) {}

    build(planCode: string) {
        return this._checkOfferNucaptchaEligibilityWorkflowService
            .build(planCode)
            .pipe(tap(displayNucaptcha => displayNucaptcha && this._store.dispatch(setDisplayNuCaptcha())));
    }
}
