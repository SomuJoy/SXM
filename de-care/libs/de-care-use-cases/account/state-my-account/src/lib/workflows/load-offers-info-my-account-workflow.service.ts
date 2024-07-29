import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, mapTo } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { LoadOffersInfoWorkflowService, WorkflowRequest } from '@de-care/domains/offers/state-offers-info';

@Injectable({ providedIn: 'root' })
export class LoadOffersInfoMyAccountWorkflowService implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService) {}

    build(request: WorkflowRequest): Observable<boolean> {
        return this._loadOffersInfoWorkflowService.build(request).pipe(
            mapTo(true),
            catchError(() => {
                // error loading offers info
                throw 'OFFERS_INFO_ERROR';
            })
        );
    }
}
