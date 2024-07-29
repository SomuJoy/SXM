import { Injectable } from '@angular/core';
import { AdobeTargetFlagsService } from '@de-care/shared/adobe-target-provider';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { setAdobeFlags } from '../state/actions';
import { markAdobeFeatureFlagsByFlagNameAsConsumed } from '../state/public.actions';

@Injectable({ providedIn: 'root' })
export class LoadAndConsumeAdobeFeatureFlagsWorkflowService implements DataWorkflow<{ flagNames: string[] }, boolean> {
    constructor(private readonly _adobeTargetFlagsService: AdobeTargetFlagsService, private readonly _store: Store) {}

    build({ flagNames }: { flagNames: string[] }): Observable<boolean> {
        return this._adobeTargetFlagsService.buildGetFlagsQuery(flagNames).pipe(
            tap((adobeFlags) => {
                this._store.dispatch(setAdobeFlags({ adobeFlags }));
                this._store.dispatch(markAdobeFeatureFlagsByFlagNameAsConsumed({ flagNames }));
            }),
            map(() => true)
        );
    }
}
