import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, mapTo, take, tap } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { LoadQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';
import { clearNuCaptchaRequired, getSelectedPlanCode, setNuCaptchaRequired } from '@de-care/de-care-use-cases/checkout/state-common';
import { getReviewDataForWorkflow } from '../state/selectors';
import { CheckOfferNucaptchaEligibilityWorkflowService } from '@de-care/domains/offers/state-eligibility';

@Injectable({ providedIn: 'root' })
export class LoadReviewDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadQuoteWorkflowService: LoadQuoteWorkflowService,
        private readonly _checkOfferNuCaptchaEligibilityWorkflowService: CheckOfferNucaptchaEligibilityWorkflowService
    ) {}

    private _checkCaptcha$ = this._store.select(getSelectedPlanCode).pipe(
        take(1),
        concatMap((planCode) => this._checkOfferNuCaptchaEligibilityWorkflowService.build(planCode)),
        tap((required) => {
            this._store.dispatch(required ? setNuCaptchaRequired() : clearNuCaptchaRequired());
        }),
        mapTo(true)
        // TODO: do we want to silently catch errors here as to not block a sale?
    );

    build(): Observable<boolean> {
        return this._store.select(getReviewDataForWorkflow).pipe(
            take(1),
            concatMap((request) => this._loadQuoteWorkflowService.build(request)),
            concatMap(() => this._checkCaptcha$),
            catchError((error) => {
                return throwError(error);
            })
        );
    }
}
