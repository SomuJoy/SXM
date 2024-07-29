import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { StreamingEligibilityService, StreamingEligibilityServiceResponse } from '../data-services/streaming-eligibility.service';

@Injectable({ providedIn: 'root' })
export class CheckIfRadioIsStreamingEligibleWorkflowService implements DataWorkflow<{ radioId: string }, StreamingEligibilityServiceResponse> {
    constructor(private readonly _streamingEligibilityService: StreamingEligibilityService) {}

    build(request): Observable<StreamingEligibilityServiceResponse> {
        return this._streamingEligibilityService.isStreamingEligible(request).pipe();
    }
}
