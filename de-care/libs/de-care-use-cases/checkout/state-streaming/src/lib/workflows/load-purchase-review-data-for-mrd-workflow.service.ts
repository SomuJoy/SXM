import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoadQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';
import { Observable, of } from 'rxjs';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { concatMap, mapTo, tap, withLatestFrom } from 'rxjs/operators';
import { getMrdQuoteRequestData } from '../state/selectors';
import { clearNuCaptchaRequired, getSelectedPlanCode, setNuCaptchaRequired } from '@de-care/de-care-use-cases/checkout/state-common';
import { CheckOfferNucaptchaEligibilityWorkflowService } from '@de-care/domains/offers/state-eligibility';
import { LoadOffersForMrdWorkflowService } from './private/load-offers-for-mrd-workflow.service';

@Injectable({ providedIn: 'root' })
export class LoadPurchaseReviewDataForMrdWorkflowService implements DataWorkflow<{ loadFallback: boolean }, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadOffersForMrdWorkflowService: LoadOffersForMrdWorkflowService,
        private readonly _loadQuoteWorkflowService: LoadQuoteWorkflowService,
        private readonly _checkOfferNuCaptchaEligibilityWorkflowService: CheckOfferNucaptchaEligibilityWorkflowService
    ) {}

    build({ loadFallback = false }: { loadFallback: boolean }): Observable<boolean> {
        const start$ = loadFallback ? this._loadOffersForMrdWorkflowService.build({ retrieveFallbackOffer: true }) : of(true);

        return start$.pipe(
            withLatestFrom(this._store.select(getSelectedPlanCode)),
            concatMap(([, planCode]) =>
                this._checkOfferNuCaptchaEligibilityWorkflowService.build(planCode).pipe(
                    tap((required) => {
                        this._store.dispatch(required ? setNuCaptchaRequired() : clearNuCaptchaRequired());
                    }),
                    mapTo(true)
                    // TODO: do we want to silently catch errors here as to not block a sale?
                )
            ),
            withLatestFrom(this._store.select(getMrdQuoteRequestData)),
            concatMap(([, request]) => this._loadQuoteWorkflowService.build({ ...request, subscriptionId: 'false' }))
        );
    }
}
