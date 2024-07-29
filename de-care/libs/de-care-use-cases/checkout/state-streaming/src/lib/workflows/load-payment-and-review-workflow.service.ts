import { Injectable } from '@angular/core';
import { clearNuCaptchaRequired, setNuCaptchaRequired } from '@de-care/de-care-use-cases/checkout/state-common';
import { CheckOfferNucaptchaEligibilityWorkflowService } from '@de-care/domains/offers/state-eligibility';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { mapTo, concatMap, tap, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class LoadPaymentAndReviewWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store, private readonly _checkOfferNuCaptchaEligibilityWorkflowService: CheckOfferNucaptchaEligibilityWorkflowService) {}
    build() {
        return this._store.select(getFirstOfferPlanCode).pipe(
            concatMap((planCode) => this._checkOfferNuCaptchaEligibilityWorkflowService.build(planCode)),
            tap((required) => {
                this._store.dispatch(required ? setNuCaptchaRequired() : clearNuCaptchaRequired());
            }),
            take(1),
            mapTo(true)
        );
    }
}
