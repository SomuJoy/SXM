import { Injectable } from '@angular/core';
import { LogoutWorkflowService } from '@de-care/domains/account/state-login';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountLogoutWorkflowService implements DataWorkflow<null, boolean> {
    constructor(private readonly _logoutWorkflowService: LogoutWorkflowService) {}

    build(): Observable<boolean> {
        return this._logoutWorkflowService.build({ source: 'PHX' });
    }
}
