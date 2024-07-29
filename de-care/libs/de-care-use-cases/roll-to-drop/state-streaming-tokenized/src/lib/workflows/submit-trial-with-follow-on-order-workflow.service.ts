import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of, throwError } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { catchError, concatMap, map, take, tap } from 'rxjs/operators';
import { CreateNewAccountWithSubscriptionWorkflowService } from '@de-care/domains/subscriptions/state-new-account';
import { setSubmitOrderAsNotProcessing, setSubmitOrderAsProcessing } from '../state/actions';
import { getSubmitTrialWithFollowOnOrderDataWitoutServiceAddress } from '../state/selectors';
import { setNewAccountResults } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class SubmitTrialWithFollowOnOrderWorkflowService implements DataWorkflow<{ login: string; password: string }, void> {
    constructor(
        private readonly _store: Store,
        private readonly _createNewAccountWithSubscriptionWorkflowService: CreateNewAccountWithSubscriptionWorkflowService,
        private readonly _translationService: TranslateService
    ) {}

    build(loginData: { login: string; password: string }): Observable<void> {
        return this._store.pipe(
            select(getSubmitTrialWithFollowOnOrderDataWitoutServiceAddress),
            take(1),
            tap(() => this._store.dispatch(setSubmitOrderAsProcessing())),
            concatMap((request) =>
                this._createNewAccountWithSubscriptionWorkflowService
                    .build({ ...request, streamingInfo: { ...loginData }, languagePreference: this._translationService.currentLang })
                    .pipe(
                        map(({ subscriptionId, isOfferStreamingEligible, isEligibleForRegistration, email }) => {
                            this._store.dispatch(setNewAccountResults({ subscriptionId, isOfferStreamingEligible, isEligibleForRegistration, email }));
                            this._store.dispatch(setSubmitOrderAsNotProcessing());
                            return;
                        }),
                        catchError((error) => {
                            this._store.dispatch(setSubmitOrderAsNotProcessing());
                            return throwError(error);
                        })
                    )
            )
        );
    }
}
