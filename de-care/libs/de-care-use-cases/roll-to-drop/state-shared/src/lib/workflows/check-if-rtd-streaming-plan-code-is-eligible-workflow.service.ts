import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { CheckEligibilityForStreamingPlanCodeWorkflowService } from '@de-care/domains/offers/state-eligibility';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { getEligiblityCheckRequestData } from '../state/selectors';

@Injectable({ providedIn: 'root' })
export class CheckIfRTDStreamingPlanCodeIsEligibleWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store, private readonly _checkEligiblityForStreamingPlanCodeWorkflowService: CheckEligibilityForStreamingPlanCodeWorkflowService) {}

    build(): Observable<boolean> {
        return this._store.select(getEligiblityCheckRequestData).pipe(
            take(1),
            concatMap(request => this._checkEligiblityForStreamingPlanCodeWorkflowService.build(request)),
            map(results => results.isEligible)
        );
    }
}
