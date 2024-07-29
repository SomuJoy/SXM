import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DataUpdateUseCaseService } from '../data-services/data-update-use-case.service';

interface UpdateUseCaseWorkflowRequest {
    useCase: string;
    keepCustomerInfo?: boolean;
    identifiedUser?: boolean;
}

export interface UpdateUseCaseWorkflowResponse {
    status: boolean;
}

@Injectable({ providedIn: 'root' })
export class UpdateUsecaseWorkflowService implements DataWorkflow<UpdateUseCaseWorkflowRequest, UpdateUseCaseWorkflowResponse | null> {
    constructor(private readonly _store: Store, private readonly _dataUpdateUseCaseService: DataUpdateUseCaseService) {}

    build({ useCase, keepCustomerInfo, identifiedUser }: UpdateUseCaseWorkflowRequest): Observable<UpdateUseCaseWorkflowResponse | null> {
        return this._dataUpdateUseCaseService.updateUseCase({ useCase, keepCustomerInfo, identifiedUser });
    }
}
