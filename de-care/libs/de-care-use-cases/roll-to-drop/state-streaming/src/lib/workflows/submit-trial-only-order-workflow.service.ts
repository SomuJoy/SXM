import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, withLatestFrom, take } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { ActivateTrialAccountWithSubscriptionWorkflowService } from '@de-care/domains/subscriptions/state-trial-activation-new-account';
import { getSubmitTrialOnlyOrderData } from '../state/selectors/submit-order.selectors';
import { LoadQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';
import { behaviorEventReactionActiveSubscriptionId } from '@de-care/shared/state-behavior-events';
import {
    getRequestDataForQuoteQuery,
    setLoadYourInfoDataAsNotProcessing,
    setLoadYourInfoDataAsProcessing,
    setNewAccountResults,
} from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { isPasswordPolicyError, PasswordUnexpectedError } from '@de-care/shared/de-microservices-common';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class SubmitTrialOnlyOrderWorkflowService implements DataWorkflow<void, void> {
    constructor(
        private readonly _store: Store,
        private readonly _loadQuoteWorkflowService: LoadQuoteWorkflowService,
        private readonly _activateTrialAccountWithSubscriptionWorkflowService: ActivateTrialAccountWithSubscriptionWorkflowService,
        private readonly _translationService: TranslateService
    ) {}

    build(): Observable<void> {
        this._store.dispatch(setLoadYourInfoDataAsProcessing());
        return this._loadQuotes().pipe(
            withLatestFrom(this._store.pipe(select(getSubmitTrialOnlyOrderData))),
            concatMap(([isQuoteLoaded, request]) =>
                this._activateTrialAccountWithSubscriptionWorkflowService.build({ ...request, languagePreference: this._translationService.currentLang }).pipe(
                    map(({ subscriptionId, isOfferStreamingEligible, isEligibleForRegistration, email }) => {
                        this._store.dispatch(setNewAccountResults({ subscriptionId, isOfferStreamingEligible, isEligibleForRegistration, email }));
                        this._store.dispatch(behaviorEventReactionActiveSubscriptionId({ id: subscriptionId?.toString() }));
                        this._store.dispatch(setLoadYourInfoDataAsNotProcessing());
                        return;
                    }),
                    catchError((error) => {
                        this._store.dispatch(setLoadYourInfoDataAsNotProcessing());
                        if (isPasswordPolicyError(error.status, error?.error?.error?.errorPropKey)) {
                            return throwError(new PasswordUnexpectedError('Unexpected Password Error'));
                        }
                        return throwError(error);
                    })
                )
            )
        );
    }

    private _loadQuotes() {
        return this._store.pipe(
            select(getRequestDataForQuoteQuery),
            take(1),
            map(({ planCode, serviceAddress }) => ({ planCodes: [planCode], serviceAddress })),
            concatMap((request) => this._loadQuoteWorkflowService.build(request))
        );
    }
}
