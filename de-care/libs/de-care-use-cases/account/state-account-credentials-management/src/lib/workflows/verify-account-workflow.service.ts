import { Injectable } from '@angular/core';
import { RegisterAccountNonPiiWorkflowService } from '@de-care/domains/account/state-account';
import { GetVerifyOptionsCredentialsWorkflow } from '@de-care/domains/account/state-register-widget';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

export type VerifyAccountWorkflowServiceResult = 'USE_EMAIL' | 'USE_PHONE' | 'USE_BOTH' | 'VERIFIED';

@Injectable({ providedIn: 'root' })
export class VerifyAccountWorkflowService implements DataWorkflow<{ identifierToLookupWith: string }, VerifyAccountWorkflowServiceResult> {
    constructor(
        private readonly _registerAccountNonPiiWorkflowService: RegisterAccountNonPiiWorkflowService,
        private readonly _getVerifyOptionsCredentialsWorkflow: GetVerifyOptionsCredentialsWorkflow,
        private readonly _store: Store
    ) {}

    build(request): Observable<VerifyAccountWorkflowServiceResult> {
        return this._registerAccountNonPiiWorkflowService.build(request).pipe(
            concatMap(() => this._getVerifyOptionsCredentialsWorkflow.build(request.accountNumber)),
            map((data) => {
                if (data.canUseEmail && data.canUsePhone) {
                    return 'USE_BOTH' as VerifyAccountWorkflowServiceResult;
                } else if (data.canUseEmail) {
                    return 'USE_EMAIL' as VerifyAccountWorkflowServiceResult;
                } else if (data.canUsePhone) {
                    return 'USE_PHONE' as VerifyAccountWorkflowServiceResult;
                } else {
                    return 'VERIFIED' as VerifyAccountWorkflowServiceResult;
                }
            })
        );
    }
}
