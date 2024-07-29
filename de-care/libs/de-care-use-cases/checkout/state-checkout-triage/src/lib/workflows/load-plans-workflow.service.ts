import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { getFirstOfferPlanCode, LoadOffersWorkflowService, LoadRenewalOffersWorkflowService } from '@de-care/domains/offers/state-offers';
import { concatMap, tap, withLatestFrom } from 'rxjs/operators';
import { behaviorEventReactionForProgramCode } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class LoadPlansWorkflowService implements DataWorkflow<{ programCode: string }, boolean> {
    constructor(private readonly _loadOffersWorkflowService: LoadOffersWorkflowService, private readonly _store: Store) {}

    build({ programCode }): Observable<boolean> {
        return this._loadOffersWorkflowService
            .build({
                programCode,
                streaming: false,
                student: false
            })
            .pipe(tap(() => programCode && this._store.dispatch(behaviorEventReactionForProgramCode({ programCode }))));
    }
}
