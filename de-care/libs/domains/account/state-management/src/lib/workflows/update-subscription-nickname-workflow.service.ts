import { Injectable } from '@angular/core';

import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UpdateSubscriptionNicknameRequest, UpdateSubscriptionNicknameService } from '../data-services/update-subscription-nickname.service';
export { UpdateSubscriptionNicknameRequest } from './../data-services/update-subscription-nickname.service';
@Injectable({ providedIn: 'root' })
export class UpdateSubscriptionNicknameWorkflowService implements DataWorkflow<UpdateSubscriptionNicknameRequest, boolean> {
    constructor(private readonly _updateSubscriptionNicknameService: UpdateSubscriptionNicknameService) {}

    build(data: UpdateSubscriptionNicknameRequest): Observable<boolean> {
        return this._updateSubscriptionNicknameService.build(data).pipe(map(() => true));
    }
}
