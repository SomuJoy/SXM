import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, take, tap } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { LoadQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';
import { setLoadYourInfoDataAsNotProcessing, setLoadYourInfoDataAsProcessing } from '../state/actions';
import { getRequestDataForQuoteQuery } from '../state/selectors';
import { TrialCheckNucaptchaRequiredWorkflowService } from './trial-check-nucaptcha-required-workflow.service';

@Injectable({ providedIn: 'root' })
export class LoadReviewOrderWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadQuoteWorkflowService: LoadQuoteWorkflowService,
        private readonly _trialCheckNucaptchaRequiredWorkflowService: TrialCheckNucaptchaRequiredWorkflowService
    ) {}

    build(): Observable<boolean> {
        return this._store.pipe(
            select(getRequestDataForQuoteQuery),
            take(1),
            map(({ planCode, serviceAddress, renewalPlanCode }) => ({ planCodes: [planCode], serviceAddress, renewalPlanCode })),
            tap(() => this._store.dispatch(setLoadYourInfoDataAsProcessing())),
            concatMap(request =>
                this._loadQuoteWorkflowService.build(request).pipe(concatMap(() => this._trialCheckNucaptchaRequiredWorkflowService.build(request.renewalPlanCode)))
            ),
            tap(() => this._store.dispatch(setLoadYourInfoDataAsNotProcessing())),
            catchError(error => {
                this._store.dispatch(setLoadYourInfoDataAsNotProcessing());
                return throwError(error);
            })
        );
    }
}
