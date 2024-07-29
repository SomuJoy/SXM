import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { TrialLegacyAdSupportedTokenService } from '../data-services/trial-legacy-ad-supported-token.service';
import { setRadioId } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class TrialLegacyAdSupportedWorkflowService implements DataWorkflow<{ token: string }, boolean> {
    constructor(private _trialLegacyAdSupportedTokenService: TrialLegacyAdSupportedTokenService, private _store: Store) {}

    build({ token }) {
        if (!token) {
            return throwError('Non Provided Token!');
        }
        return this._trialLegacyAdSupportedTokenService.detokenize(token).pipe(
            //pending validation of required fields, we are going to know about once activation service is donde
            tap((data) => this._store.dispatch(setRadioId({ radioId: data.radioId }))),
            map(() => true),
            catchError((error) => {
                return throwError(error);
            })
        );
    }
}
