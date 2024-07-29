import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, take, withLatestFrom } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { LoadQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';
import { getReviewDataForWorkflow } from '../state/review-order.selectors';
import { getSelectedPlanCode } from '../state/selectors';
import { VipCheckNucaptchaRequiredWorkflowService } from './vip-check-nucaptcha-required-workflow.service';

@Injectable()
export class LoadReviewDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadQuoteWorkflowService: LoadQuoteWorkflowService,
        private readonly _vipCheckNucaptchaRequiredWorkflowService: VipCheckNucaptchaRequiredWorkflowService
    ) {}

    build(): Observable<boolean> {
        return this._store.pipe(
            select(getReviewDataForWorkflow),
            withLatestFrom(this._store.pipe(select(getSelectedPlanCode))),
            take(1),
            concatMap(([request, planCode]) =>
                this._loadQuoteWorkflowService.build(request).pipe(concatMap(() => this._vipCheckNucaptchaRequiredWorkflowService.build(planCode)))
            ),
            catchError((error) => {
                return throwError(error);
            })
        );
    }
}
