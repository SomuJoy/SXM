import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { LoadOffersCustomerWorkflowService } from '@de-care/domains/offers/state-offers';
import { map, tap } from 'rxjs/operators';
import { behaviorEventReactionForProgramCode } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class LoadCustomerPlansWorkflowService implements DataWorkflow<{ programCode: string; radioId: string; marketingPromoCode: string }, boolean> {
    constructor(private readonly _loadOffersCustomerWorkflowService: LoadOffersCustomerWorkflowService, private readonly _store: Store) {}

    build({ radioId, programCode, marketingPromoCode }): Observable<boolean> {
        return this._loadOffersCustomerWorkflowService
            .build({
                programCode,
                radioId,
                marketingPromoCode
            })
            .pipe(
                tap(() => programCode && this._store.dispatch(behaviorEventReactionForProgramCode({ programCode }))),
                map(() => true)
            );
    }
}
