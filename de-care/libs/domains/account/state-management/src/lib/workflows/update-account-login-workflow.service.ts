import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UpdateAccountLoginRequest, UpdateAccountLoginService } from '../data-services/update-account-login.service';
export { UpdateAccountLoginRequest } from '../data-services/update-account-login.service';

@Injectable({ providedIn: 'root' })
export class UpdateAccountLoginWorkflowService implements DataWorkflow<UpdateAccountLoginRequest, boolean> {
    constructor(private readonly _updateAccountLoginService: UpdateAccountLoginService) {}

    build(data: UpdateAccountLoginRequest): Observable<boolean> {
        return this._updateAccountLoginService.build(data).pipe(map(() => true));
    }
}
