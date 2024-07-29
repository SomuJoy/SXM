import { Inject, Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { from, Observable, of } from 'rxjs';
import { LoadEnvironmentInfoWorkflowService } from './load-environment-info-workflow.service';
import { CLIENT_SDK, IClientSDK } from '@de-care/shared/configuration-tokens-client-sdk';
import { concatMap, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class InitializeDataSourceWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService, @Inject(CLIENT_SDK) private readonly _clientSDK: IClientSDK) {}

    build(): Observable<boolean> {
        return this._loadEnvironmentInfoWorkflowService.build().pipe(
            concatMap(() => {
                return from(this._clientSDK.device.grant());
            }),
            map(() => true)
        );
    }
}
