import { map, tap } from 'rxjs/operators';
import { DataAuthenticateService, LogoutRequest } from './../data-services/data-authenticate.service';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { behaviorEventReactionAuthenticationStatusUnidentified } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class LogoutWorkflowService implements DataWorkflow<LogoutRequest, boolean> {
    constructor(private readonly _dataAuthenticationService: DataAuthenticateService, private readonly _store: Store) {}

    build(request: LogoutRequest): Observable<boolean> {
        return this._dataAuthenticationService.logout(request).pipe(
            tap(() => this._store.dispatch(behaviorEventReactionAuthenticationStatusUnidentified())),
            map(() => true)
        );
    }
}
