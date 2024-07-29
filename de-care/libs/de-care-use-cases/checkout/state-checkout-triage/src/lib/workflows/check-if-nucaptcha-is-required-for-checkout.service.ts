import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { CheckOfferNucaptchaEligibilityWorkflowService } from '@de-care/domains/offers/state-eligibility';
import { tap } from 'rxjs/operators';
import { setNucaptchaNonRequired, setNucaptchaRequired } from '../state/checkout-triage.actions';

@Injectable({ providedIn: 'root' })
export class CheckIfNuCaptchaIsRequiredForCheckoutWorkflowService implements DataWorkflow<string, boolean> {
    constructor(private readonly _store: Store, private readonly _checkOfferNucaptchaEligibilityWorkflowService: CheckOfferNucaptchaEligibilityWorkflowService) {}

    build(planCode: string) {
        return this._checkOfferNucaptchaEligibilityWorkflowService
            .build(planCode)
            .pipe(tap(required => this._store.dispatch(required ? setNucaptchaRequired() : setNucaptchaNonRequired())));
    }
}
