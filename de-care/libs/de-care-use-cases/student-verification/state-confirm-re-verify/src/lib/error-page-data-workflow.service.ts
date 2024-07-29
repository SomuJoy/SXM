import { LoadOffersWorkflowService } from '@de-care/domains/offers/state-offers';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

interface ErrorWorkflowParams {
    student: boolean;
    programCode: string;
    streaming: boolean;
}

@Injectable({ providedIn: 'root' })
export class ErrorPageDataWorkflowService implements DataWorkflow<ErrorWorkflowParams, boolean> {
    constructor(private _loadOffersWorkflowService: LoadOffersWorkflowService) {}

    build({ student, programCode, streaming }): Observable<boolean> {
        return this._loadOffersWorkflowService.build({ student, streaming, programCode });
    }
}
