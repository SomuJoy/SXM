import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

export interface UpdateUseCaseServiceRequestModel {
    useCase: string;
}

export enum LoadRtdStreamingPurchaseDataWorkflowStatus {
    success = 'SUCCESS',
    fail = 'FAIL',
    error = 'ERROR',
}

@Injectable({ providedIn: 'root' })
export class LoadRtdStreamingPurchaseDataWorkflowService implements DataWorkflow<UpdateUseCaseServiceRequestModel, LoadRtdStreamingPurchaseDataWorkflowStatus> {
    constructor(private readonly _updateUseCaseWorkflowService: UpdateUsecaseWorkflowService) {}

    build(request: UpdateUseCaseServiceRequestModel) {
        return this._updateUseCaseWorkflowService.build(request).pipe(
            map((status) => (status ? LoadRtdStreamingPurchaseDataWorkflowStatus.success : LoadRtdStreamingPurchaseDataWorkflowStatus.fail)),
            catchError(() => {
                return of(LoadRtdStreamingPurchaseDataWorkflowStatus.error);
            })
        );
    }
}
