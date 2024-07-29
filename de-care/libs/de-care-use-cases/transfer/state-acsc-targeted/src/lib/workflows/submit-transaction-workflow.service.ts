import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store, select } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { getIsModeServiceContinuity, getIsModeServicePortability } from '../state/selectors/state.selectors';
import { take, tap, catchError, withLatestFrom, mergeMap, mapTo } from 'rxjs/operators';
import { ChangeSubscriptionWorkflowService } from '@de-care/domains/purchase/state-change-subscription';
import { CompleteServiceContinuityWorkflowService } from '@de-care/domains/purchase/state-service-continuity';
import {
    setSubmitTransactionAsProcessing,
    setSubmitTransactionAsNotProcessing,
    setUserNameIsSameAsEmail,
    setUserNameIsNotSameAsEmail,
    setSelectedSubscriptionIDForSAL,
    setIsRefreshAllowed,
} from '../state/actions';
import { getServiceContinuityData } from '../state/selectors/review-order.selectors';
import { getChangeSubscriptionData } from '../state/selectors/public.selectors';
import { setIsEligibleForRegistration, setPrefillEmail } from '@de-care/domains/account/state-account';
import {
    behaviorEventReactionServiceContinuityFailure,
    behaviorEventReactionChangeSubscriptionFailure,
    behaviorEventReactionServiceContinuitySuccess,
} from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class SubmitTransactionWorkflowService implements DataWorkflow<null, null> {
    constructor(
        private readonly _store: Store,
        private readonly _changeSubscriptionWorkflowService: ChangeSubscriptionWorkflowService,
        private readonly _completeServiceContinuityWorkflowService: CompleteServiceContinuityWorkflowService
    ) {}

    build(): Observable<any> {
        return this._store.pipe(
            select(getIsModeServiceContinuity),
            take(1),
            tap(() => this._store.dispatch(setSubmitTransactionAsProcessing())),
            withLatestFrom(
                this._store.pipe(select(getIsModeServicePortability)),
                this._store.pipe(select(getChangeSubscriptionData)),
                this._store.pipe(select(getServiceContinuityData))
            ),
            mergeMap(([isModeSC, isModeSP, changeSubData, scData]) => {
                if (isModeSC || isModeSP) {
                    return this._completeServiceContinuityWorkflowService.build(scData).pipe(
                        tap((response) => {
                            this._store.dispatch(setSelectedSubscriptionIDForSAL({ selectedSubscriptionIDForSAL: response?.subscriptionId }));
                            const { isEligibleForRegistration, isOfferStreamingEligible, email, isUserNameSameAsEmail } = response || {};
                            this._store.dispatch(setIsEligibleForRegistration({ isEligibleForRegistration, requiresCredentials: isOfferStreamingEligible }));
                            this._store.dispatch(setPrefillEmail({ email }));
                            isUserNameSameAsEmail ? this._store.dispatch(setUserNameIsSameAsEmail()) : this._store.dispatch(setUserNameIsNotSameAsEmail());
                            this._store.dispatch(behaviorEventReactionServiceContinuitySuccess());
                            this._store.dispatch(setSubmitTransactionAsNotProcessing());
                        }),
                        catchError((error) => {
                            this._store.dispatch(setSubmitTransactionAsNotProcessing());
                            const errorCode = error?.error?.error?.errorCode ?? '';
                            this._store.dispatch(behaviorEventReactionServiceContinuityFailure({ errorMessage: errorCode }));
                            return throwError(error);
                        }),
                        mapTo(null)
                    );
                } else {
                    return this._changeSubscriptionWorkflowService.build(changeSubData).pipe(
                        tap((response) => {
                            const { isEligibleForRegistration, isOfferStreamingEligible, email, isUserNameSameAsEmail } = response || {};
                            this._store.dispatch(setIsEligibleForRegistration({ isEligibleForRegistration, requiresCredentials: isOfferStreamingEligible }));
                            this._store.dispatch(setPrefillEmail({ email }));
                            isUserNameSameAsEmail ? this._store.dispatch(setUserNameIsSameAsEmail()) : this._store.dispatch(setUserNameIsNotSameAsEmail());
                            this._store.dispatch(setSubmitTransactionAsNotProcessing());
                            this._store.dispatch(setSelectedSubscriptionIDForSAL({ selectedSubscriptionIDForSAL: response?.subscriptionId }));
                            this._store.dispatch(setIsRefreshAllowed({ isRefreshAllowed: response.isRefreshAllowed }));
                        }),
                        catchError((error) => {
                            this._store.dispatch(setSubmitTransactionAsNotProcessing());
                            const errorCode = error?.error?.error?.errorCode ?? '';
                            this._store.dispatch(behaviorEventReactionChangeSubscriptionFailure({ errorMessage: errorCode }));
                            return throwError(error);
                        }),
                        mapTo(null)
                    );
                }
            })
        );
    }
}
