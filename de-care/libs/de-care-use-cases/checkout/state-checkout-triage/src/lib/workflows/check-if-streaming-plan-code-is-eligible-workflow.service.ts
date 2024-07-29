import { CheckEligibilityForStreamingPlanCodeWorkflowService } from '@de-care/domains/offers/state-eligibility';
import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { getEligibilityCheckRequestData } from '../state/checkout-triage.selectors';

@Injectable({ providedIn: 'root' })
export class CheckIfStreamingPlanCodeIsEligibleWorkflowService implements DataWorkflow<string | null, boolean> {
    constructor(private readonly _store: Store, private readonly _checkEligibilityForStreamingPlanCodeWorkflowService: CheckEligibilityForStreamingPlanCodeWorkflowService) {}

    build(planCode?: string): Observable<boolean> {
        return this._store.select(getEligibilityCheckRequestData).pipe(
            take(1),
            // If a planCode was passed in we want to use that as an override from the one we got from getEligibilityCheckRequestData
            map(request => (planCode ? { ...request, planCode } : request)),
            concatMap(request => this._checkEligibilityForStreamingPlanCodeWorkflowService.build(request)),
            map(results => results.isEligible)
        );
    }
}
