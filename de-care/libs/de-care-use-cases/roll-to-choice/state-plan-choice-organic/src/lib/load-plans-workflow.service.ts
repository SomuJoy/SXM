import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { getFirstOfferPlanCode, LoadOffersWorkflowService, LoadRenewalOffersWorkflowService } from '@de-care/domains/offers/state-offers';
import { concatMap, tap, withLatestFrom } from 'rxjs/operators';
import { behaviorEventReactionForProgramCode } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class LoadPlansWorkflowService implements DataWorkflow<{ programCode: string; renewalCode: string }, boolean> {
    constructor(
        private readonly _loadOffersWorkflowService: LoadOffersWorkflowService,
        private readonly _loadRenewalOffersWorkflowService: LoadRenewalOffersWorkflowService,
        private readonly _store: Store
    ) {}

    build({ programCode, renewalCode }): Observable<boolean> {
        if (!programCode) {
            return throwError('Program code not found');
        }
        return this._loadOffersWorkflowService
            .build({
                programCode,
                streaming: false,
                student: false
            })
            .pipe(
                tap(() => programCode && this._store.dispatch(behaviorEventReactionForProgramCode({ programCode }))),
                withLatestFrom(this._store.pipe(select(getFirstOfferPlanCode))),
                concatMap(([_, planCode]) => this._loadRenewalOffersWorkflowService.build({ planCode, renewalCode, streaming: false }))
            );
    }
}
