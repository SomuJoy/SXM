import { Injectable } from '@angular/core';
import { ModifySubscriptionOptionsWorkflowService } from '@de-care/domains/account/state-management';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';

interface ModifySubscriptionOptionsRequest {
    subscriptionId: string | number;
}

@Injectable({ providedIn: 'root' })
export class ModifySubscriptionDropdownOptionsWorkflowService implements DataWorkflow<ModifySubscriptionOptionsRequest, boolean> {
    constructor(private readonly _modifySubscriptionOptionsWorkflowService: ModifySubscriptionOptionsWorkflowService) {}

    build(request: ModifySubscriptionOptionsRequest): Observable<boolean> {
        return this._modifySubscriptionOptionsWorkflowService.build(request);
    }
}
