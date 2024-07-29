import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoadQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';
import { Observable } from 'rxjs';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { concatMap, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { clearNuCaptchaRequired, getSelectedPlanCode, setNuCaptchaRequired } from '@de-care/de-care-use-cases/checkout/state-common';
import { CheckOfferNucaptchaEligibilityWorkflowService } from '@de-care/domains/offers/state-eligibility';
import { getQuoteRequestData } from '../state/selectors';

@Injectable({ providedIn: 'root' })
export class LoadPurchaseReviewDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadQuoteWorkflowService: LoadQuoteWorkflowService,
        private readonly _checkOfferNuCaptchaEligibilityWorkflowService: CheckOfferNucaptchaEligibilityWorkflowService
    ) {}

    build(): Observable<boolean> {
        return this._store.select(getSelectedPlanCode).pipe(
            take(1),
            concatMap((planCode) =>
                this._checkOfferNuCaptchaEligibilityWorkflowService.build(planCode).pipe(
                    tap((required) => {
                        this._store.dispatch(required ? setNuCaptchaRequired() : clearNuCaptchaRequired());
                    }),
                    mapTo(true)
                )
            ),
            withLatestFrom(this._store.select(getQuoteRequestData)),
            concatMap(([, request]) => this._loadQuoteWorkflowService.build(request))
        );
    }
}
