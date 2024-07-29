import { Inject, Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { from, Observable, of } from 'rxjs';
import { UpdateUsecaseWorkflowService } from './update-usecase-workflow.service';
import { concatMap, map } from 'rxjs/operators';
import { CLIENT_SDK, IClientSDK } from '@de-care/shared/configuration-tokens-client-sdk';

interface StartTransactionSessionWorkflowRequest {
    useCase: string;
    keepCustomerInfo?: boolean;
    identifiedUser?: boolean;
}

export interface StartTransactionSessionWorkflowResponse {
    status: boolean;
}

@Injectable({ providedIn: 'root' })
export class StartTransactionSessionWorkflowService implements DataWorkflow<StartTransactionSessionWorkflowRequest, StartTransactionSessionWorkflowResponse> {
    constructor(private readonly _updateUseCaseWorkflowService: UpdateUsecaseWorkflowService, @Inject(CLIENT_SDK) private readonly _clientSDK: IClientSDK) {}

    build({ useCase, keepCustomerInfo, identifiedUser }: StartTransactionSessionWorkflowRequest): Observable<StartTransactionSessionWorkflowResponse> {
        return this._updateUseCaseWorkflowService.build({ useCase, keepCustomerInfo, identifiedUser }).pipe(
            concatMap(() => {
                return from(this._clientSDK.user.startSessionAnonymous());
            }),
            map(() => {
                return { status: true };
            })
        );
    }
}
