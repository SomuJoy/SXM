import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CheckEligibilityForStreamingPlanCodeWorkflowService } from '@de-care/domains/offers/state-eligibility';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { concatMap, map, take, tap } from 'rxjs/operators';
import { getEligibilityCheckRequestData } from '../state/selectors';
import { setfailedEligibilityCheckToFalse, setfailedEligibilityCheckToTrue } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class CheckEligibilityBasedOnPaymentInfoWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store, private readonly _checkEligibilityForStreamingPlanCodeWorkflowService: CheckEligibilityForStreamingPlanCodeWorkflowService) {}

    build(): Observable<boolean> {
        return this._store.select(getEligibilityCheckRequestData).pipe(
            take(1),
            concatMap((request) =>
                this._checkEligibilityForStreamingPlanCodeWorkflowService.build(request).pipe(
                    tap(({ isEligible }) => {
                        if (isEligible) {
                            this._store.dispatch(setfailedEligibilityCheckToFalse());
                        } else {
                            this._store.dispatch(setfailedEligibilityCheckToTrue());
                        }
                    })
                )
            ),
            map(({ isEligible }) => isEligible)
        );
    }
}
