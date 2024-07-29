import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { ConfigureAddRadioRouterDataWorkflowService } from './configure-add-radio-router-data-workflow.service';
import { CollectInboundQueryParamsWorkflowService } from '@de-care/de-care-use-cases/checkout/state-common';

@Injectable({ providedIn: 'root' })
export class LoadAddRadioActivateRadioWorkflowService implements DataWorkflow<void, any> {
    constructor(
        private readonly _configureAddRadioRouterDataWorkflowService: ConfigureAddRadioRouterDataWorkflowService,
        private readonly _collectInboundQueryParamsWorkflowService: CollectInboundQueryParamsWorkflowService
    ) {}

    build(): Observable<any> {
        return this._collectInboundQueryParamsWorkflowService.build().pipe(concatMap(() => this._configureAddRadioRouterDataWorkflowService.build().pipe(map(() => true))));
    }
}
