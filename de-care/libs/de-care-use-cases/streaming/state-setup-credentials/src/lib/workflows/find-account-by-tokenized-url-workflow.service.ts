import { Injectable } from '@angular/core';
import { LoadAccountFromTokenOnboardingWorkflowService, LookupCompletedDatas } from '@de-care/domains/account/state-account';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { collectSelectedRadioIdLastFour } from '../state/actions';
import { behaviorEventErrorFromBusinessLogic } from '@de-care/shared/state-behavior-events';
import { CookieService } from 'ngx-cookie-service';

export type FindAccountByTokenizedUrlDataWorkflowServiceError = 'INVALID_TOKEN';

@Injectable({ providedIn: 'root' })
export class FindAccountByTokenizedUrlDataWorkflowService implements DataWorkflow<{ token: string; tokenType?: string; radioid: string; act: string }, LookupCompletedDatas> {
    constructor(
        private readonly _loadAccountFromTokenOnboardingWorkflowService: LoadAccountFromTokenOnboardingWorkflowService,
        private readonly _store: Store,
        private _cookieService: CookieService
    ) {}

    build({ token, tokenType, radioid, act }): Observable<LookupCompletedDatas> {
        const identityToken = this._cookieService.get('ID_TOKEN');
        if (!token && identityToken && !radioid) {
            tokenType = 'ACCOUNT';
            token = identityToken;
        }
        if (token || radioid) {
            return this._loadAccountFromTokenOnboardingWorkflowService.build({ token, tokenType, radioid, act }).pipe(
                tap(({ singleResultRadioIdLastFour }) => {
                    this._store.dispatch(collectSelectedRadioIdLastFour({ selectedRadioIdLastFour: singleResultRadioIdLastFour }));
                })
            );
        } else {
            this._store.dispatch(behaviorEventErrorFromBusinessLogic({ message: 'Token is empty/missing' }));
            throw 'INVALID_TOKEN' as FindAccountByTokenizedUrlDataWorkflowServiceError;
        }
    }
}
