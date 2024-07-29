import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { getAccountRegistered, getFirstAccountSubscription, setIsEligibleForRegistration } from '@de-care/domains/account/state-account';
import { fetchSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { getAllNonDataCapableOffersAsArray, LoadOffersCustomerWorkflowService, Offer } from '@de-care/domains/offers/state-offers';
import { ChangeSubscriptionWorkflowService } from '@de-care/domains/purchase/state-change-subscription';
import { LoadQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, mapTo, withLatestFrom, tap } from 'rxjs/operators';

export enum ActivateStudentRolloverWorkflowServiceStatus {
    'success' = 'success',
    'fail' = 'fail',
}

@Injectable({ providedIn: 'root' })
export class ActivateStudentRolloverWorkflowService implements DataWorkflow<{ programCode: string }, ActivateStudentRolloverWorkflowServiceStatus> {
    constructor(
        private _loadOffersCustomerWorkflowService: LoadOffersCustomerWorkflowService,
        private _loadQuoteWorkflowService: LoadQuoteWorkflowService,
        private _changeSubscriptionWorkflowService: ChangeSubscriptionWorkflowService,
        private _store: Store
    ) {}

    build({ programCode }): Observable<ActivateStudentRolloverWorkflowServiceStatus> {
        return this._store.pipe(
            select(getFirstAccountSubscription),
            concatMap((subscription) => this._loadOffers(subscription?.id, programCode)),
            withLatestFrom(this._store.pipe(select(getAccountRegistered))),
            tap(([_, accountRegistered]) => this._loadSecurityQuestions(accountRegistered)),
            mapTo(ActivateStudentRolloverWorkflowServiceStatus.success),
            catchError(() => of(ActivateStudentRolloverWorkflowServiceStatus.fail))
        );
    }

    private _loadSecurityQuestions(accountRegistered: boolean) {
        return this._store.dispatch(fetchSecurityQuestions({ accountRegistered })); // fire and forget
    }

    private _loadOffers(subscriptionId, programCode) {
        return this._loadOffersCustomerWorkflowService
            .build({
                subscriptionId,
                programCode,
                streaming: true,
                student: true,
            })
            .pipe(
                withLatestFrom(this._store.pipe(select(getAllNonDataCapableOffersAsArray))),
                concatMap(([_, offers]) => this._loadQuotes(offers, subscriptionId))
            );
    }

    private _changeSubscription(subscriptionId, offers) {
        return this._changeSubscriptionWorkflowService
            .build({
                subscriptionId,
                paymentInfo: {
                    useCardOnfile: true,
                },
                plans: offers.map((offer) => ({ planCode: offer.planCode })),
            })
            .pipe(
                tap((subscriptionResponse) => {
                    this._store.dispatch(
                        setIsEligibleForRegistration({
                            isEligibleForRegistration: subscriptionResponse.isEligibleForRegistration,
                            requiresCredentials: subscriptionResponse.isOfferStreamingEligible,
                        })
                    );
                })
            );
    }

    private _loadQuotes(offers: Offer[], subscriptionId: string) {
        return this._loadQuoteWorkflowService
            .build({
                planCodes: offers.map((offer) => offer.planCode),
                subscriptionId,
            })
            .pipe(concatMap(() => this._changeSubscription(subscriptionId, offers)));
    }
}
