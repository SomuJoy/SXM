import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { CheckStreamingEligibilityService } from '../dataservices/check-streaming-eligibility.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { behaviorEventErrorFromSystem, behaviorEventReactionForOffersEligibility } from '@de-care/shared/state-behavior-events';

export interface RequestModel {
    planCode: string;
    firstName: string;
    lastName: string;
    email: string;
    zipCode: string | number;
    creditCardNumber?: string | number;
}

export interface WorkflowResponse {
    isEligible: boolean;
    eligibilityCheckExecuted: boolean;
}

@Injectable({ providedIn: 'root' })
export class CheckEligibilityForStreamingPlanCodeWorkflowService implements DataWorkflow<RequestModel, WorkflowResponse> {
    constructor(private _store: Store, private _checkStreamingEligibilityService: CheckStreamingEligibilityService) {}

    build(request: RequestModel): Observable<WorkflowResponse> {
        return this._checkStreamingEligibilityService.checkEligibility(request).pipe(
            tap(({ isEligible, eligibilityCheckExecuted }) => {
                this._store.dispatch(behaviorEventReactionForOffersEligibility({ offers: [{ planCode: request.planCode, eligible: isEligible }] }));
                if (eligibilityCheckExecuted === false) {
                    this._store.dispatch(behaviorEventErrorFromSystem({ message: 'Eligibility check service is not available' }));
                }
            }),
            map(({ isEligible, eligibilityCheckExecuted }) => ({
                isEligible,
                eligibilityCheckExecuted
            }))
        );
    }
}
