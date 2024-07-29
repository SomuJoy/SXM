import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { catchError, concatMap, map, take, tap } from 'rxjs/operators';
import { CreateNewAccountWithSubscriptionWorkflowService } from '@de-care/domains/subscriptions/state-new-account';
import { setSubmitOrderAsNotProcessing, setSubmitOrderAsProcessing } from '../state/actions';
import { getSubmitTrialWithFollowOnOrderData, setNewAccountResults } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class SubmitTrialWithFollowOnOrderWorkflowService implements DataWorkflow<void, void> {
    constructor(
        private readonly _store: Store,
        private readonly _createNewAccountWithSubscriptionWorkflowService: CreateNewAccountWithSubscriptionWorkflowService,
        private readonly _translationService: TranslateService
    ) {}

    build(): Observable<void> {
        return this._store.pipe(
            select(getSubmitTrialWithFollowOnOrderData),
            take(1),
            tap(() => this._store.dispatch(setSubmitOrderAsProcessing())),
            concatMap((request) =>
                this._createNewAccountWithSubscriptionWorkflowService.build({ ...request, languagePreference: this._translationService.currentLang }).pipe(
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
