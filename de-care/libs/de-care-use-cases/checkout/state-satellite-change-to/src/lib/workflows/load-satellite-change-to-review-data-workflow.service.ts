import { Injectable } from '@angular/core';
import { clearNuCaptchaRequired, getSelectedPlanCode, setNuCaptchaRequired } from '@de-care/de-care-use-cases/checkout/state-common';
import { CheckOfferNucaptchaEligibilityWorkflowService } from '@de-care/domains/offers/state-eligibility';
import { LoadQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { getQuoteRequestData } from '../state/selectors';

export type LoadChangeToReviewDataWorkflowServiceErrors = 'SYSTEM';
@Injectable({ providedIn: 'root' })
export class LoadChangeToReviewDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private _loadQuoteWorkflowService: LoadQuoteWorkflowService,
        private _checkOfferNuCaptchaEligibilityWorkflowService: CheckOfferNucaptchaEligibilityWorkflowService
    ) {}

    build(): Observable<boolean> {
        return this._store.select(getSelectedPlanCode).pipe(
            take(1),
            concatMap((planCode) =>
                this._checkOfferNuCaptchaEligibilityWorkflowService.build(planCode).pipe(
                    tap((required) => {
                        this._store.dispatch(required ? setNuCaptchaRequired() : clearNuCaptchaRequired());
                    }),
                    mapTo(true),
                    catchError((error) => throwError(error))
                )
            ),
            withLatestFrom(this._store.select(getQuoteRequestData)),
            concatMap(([, request]) => this._loadQuoteWorkflowService.build(request))
        );
    }
}
