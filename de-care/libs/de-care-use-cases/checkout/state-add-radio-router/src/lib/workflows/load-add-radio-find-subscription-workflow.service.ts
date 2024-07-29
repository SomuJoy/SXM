import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigureAddRadioRouterDataWorkflowService } from './configure-add-radio-router-data-workflow.service';

@Injectable({ providedIn: 'root' })
export class LoadAddRadioFindSubscriptionWorkflowService implements DataWorkflow<void, any> {
    constructor(private readonly _configureAddRadioRouterDataWorkflowService: ConfigureAddRadioRouterDataWorkflowService) {}

    build(): Observable<any> {
        return this._configureAddRadioRouterDataWorkflowService.build().pipe(map(() => true));
    }
}
