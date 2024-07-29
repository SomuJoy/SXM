import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CheckAccessFeatureFlagWorkflowService } from '@de-care/de-care-use-cases/account/state-my-account';
import { FullBrowserRedirect } from '@de-care/shared/browser-common/util-redirect';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CheckAccessFeatureFlagCanActivateService implements CanActivate {
    constructor(private readonly _checkAccessFeatureFlagWorkflowService: CheckAccessFeatureFlagWorkflowService, private readonly _fullBrowserRedirect: FullBrowserRedirect) {}

    canActivate() {
        return this._checkAccessFeatureFlagWorkflowService.build().pipe(
            tap((canAccess) => {
                if (!canAccess) {
                    this._fullBrowserRedirect.performRedirectToOac('/myaccount_execute.action?exp=BAU');
                }
            })
        );
    }
}
