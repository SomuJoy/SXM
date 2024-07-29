import { DataAccountNextBestActionService, NextBestActionResponse } from './../data-services/data-next-best-action.service';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
    behaviorEventReactionAuthenticationStatusAuthenticated,
    behaviorEventReactionAuthenticationStatusIdentified,
    behaviorEventReactionAuthenticationStatusUnidentified,
} from '@de-care/shared/state-behavior-events';
import { setIdentificationState } from '../state/actions';
export { NextBestActionResponse, NextBestAction, IdentificationState } from './../data-services/data-next-best-action.service';

@Injectable({ providedIn: 'root' })
export class NextBestActionWorkflowService implements DataWorkflow<null, NextBestActionResponse> {
    constructor(private _store: Store, private readonly _dataAccountNextBestActionService: DataAccountNextBestActionService) {}

    build(): Observable<NextBestActionResponse> {
        return this._dataAccountNextBestActionService.getNextBestActions().pipe(
            tap((response) => {
                this._store.dispatch(setIdentificationState({ identificationState: response?.identificationState }));

                switch (response?.identificationState) {
                    case 'LOGGEDIN':
                        this._store.dispatch(behaviorEventReactionAuthenticationStatusAuthenticated());
                        break;
                    case 'IDENTIFIED':
                        this._store.dispatch(behaviorEventReactionAuthenticationStatusIdentified());
                        break;
                    case 'UNIDENTIFIED':
                        this._store.dispatch(behaviorEventReactionAuthenticationStatusUnidentified());
                }
            })
        );
    }

    // TODO: add error catch to send behavior event
}
