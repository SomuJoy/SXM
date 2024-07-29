import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { getFirstOfferPlanCode, LoadOffersCustomerWorkflowService, LoadRenewalOffersWorkflowService } from '@de-care/domains/offers/state-offers';
import { concatMap, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { behaviorEventReactionForProgramCode } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';
import { getLandingPageInboundUrlParams } from './state/selectors/plan.selectors';

@Injectable({ providedIn: 'root' })
export class LoadCustomerPlansWorkflowService implements DataWorkflow<string, boolean> {
    constructor(
        private readonly _loadOffersCustomerWorkflowService: LoadOffersCustomerWorkflowService,
        private readonly _loadRenewalOffersWorkflowService: LoadRenewalOffersWorkflowService,
        private readonly _store: Store
    ) {}

    build(radioId: string): Observable<boolean> {
        return this._store.pipe(
            select(getLandingPageInboundUrlParams),
            take(1),
            switchMap(({ programCode, renewalCode }) =>
                this._loadOffersCustomerWorkflowService
                    .build({
                        programCode,
                        radioId
                    })
                    .pipe(
                        tap(() => programCode && this._store.dispatch(behaviorEventReactionForProgramCode({ programCode }))),
                        withLatestFrom(this._store.pipe(select(getFirstOfferPlanCode))),
                        concatMap(([_, planCode]) => this._loadRenewalOffersWorkflowService.build({ radioId, planCode, renewalCode, streaming: false }))
                    )
            )
        );
    }
}
