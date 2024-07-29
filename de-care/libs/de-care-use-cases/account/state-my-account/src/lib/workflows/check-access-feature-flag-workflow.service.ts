import { Injectable } from '@angular/core';
import { getAdobeFeatureFlags, LoadAndConsumeAdobeFeatureFlagsWorkflowService } from '@de-care/shared/state-feature-flags';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, withLatestFrom } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CheckAccessFeatureFlagWorkflowService implements DataWorkflow<null, boolean> {
    constructor(private readonly _store: Store, private readonly _loadAndConsumeAdobeFeatureFlagsWorkflowService: LoadAndConsumeAdobeFeatureFlagsWorkflowService) {}

    private _canAccessMyAccountFlagName = 'my-account-redirect';

    build(): Observable<boolean> {
        return this._loadAndConsumeAdobeFeatureFlagsWorkflowService.build({ flagNames: [this._canAccessMyAccountFlagName] }).pipe(
            withLatestFrom(this._store.select(getAdobeFeatureFlags)),
            map(([, flags]) => {
                const myAccountFlag = flags?.[this._canAccessMyAccountFlagName];
                if (myAccountFlag && myAccountFlag.flag !== undefined && myAccountFlag.flag.phx !== undefined) {
                    return flags?.[this._canAccessMyAccountFlagName]?.flag?.phx;
                } else {
                    // If we don't have the flag or the structure is not as expected then we will just return true by default
                    return true;
                }
            }),
            // silently catch errors and let through
            catchError(() => of(true))
        );
    }
}
