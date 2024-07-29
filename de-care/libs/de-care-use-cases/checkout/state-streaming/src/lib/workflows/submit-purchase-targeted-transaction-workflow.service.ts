import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { disablePageLoaderOnRouteEvent } from '@de-care/de-care/shared/state-loading';
import { getPayloadForPurchaseTargetedTransaction } from '../state/selectors';
import { setSuccessfulTransactionData } from '../state/actions';
import { CreditCardUnexpectedError } from '@de-care/shared/de-microservices-common';
import { clearUserEnteredPassword, clearPaymentInfo, newTransactionIdDueToCreditCardError, setIsRefreshAllowed } from '@de-care/de-care-use-cases/checkout/state-common';
import { behaviorEventReactionGiftCardUsedDuringPurchase } from '@de-care/shared/state-behavior-events';
import { AddSubscriptionWorkflowService } from '@de-care/domains/purchase/state-add-subscription';
import { ChangeSubscriptionWorkflowService } from '@de-care/domains/purchase/state-change-subscription';
import { getDoesAccountHaveAtLeastOneTrial } from '@de-care/domains/account/state-account';

export type SubmitPurchaseTargetedTransactionWorkflowErrors = 'CREDIT_CARD_FAILURE' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class SubmitPurchaseTargetedTransactionWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _addSubscriptionWorkflowService: AddSubscriptionWorkflowService,
        private readonly _changeSubscriptionWorkflowService: ChangeSubscriptionWorkflowService
    ) {}

    build(): Observable<boolean> {
        return this._store.select(getPayloadForPurchaseTargetedTransaction).pipe(
            take(1),
            concatMap((request) => {
                if (request.subscriptionId) {
                    return this._changeSubscriptionWorkflowService
                        .build(request, false)
                        .pipe(tap((response) => this._store.dispatch(setIsRefreshAllowed({ isRefreshAllowed: response.isRefreshAllowed }))));
                }
                return this._addSubscriptionWorkflowService.build({ ...request, subscriptionId: undefined }, false).pipe(
                    tap((response) => this._store.dispatch(setIsRefreshAllowed({ isRefreshAllowed: response.isRefreshAllowed }))),
                    tap(() => {
                        if (request.paymentInfo.giftCards.some((giftCard) => !!giftCard)) {
                            this._store.dispatch(behaviorEventReactionGiftCardUsedDuringPurchase());
                        }
                    })
                );
            }),
            map(({ email, accountNumber, subscriptionId, isUserNameSameAsEmail, isEligibleForRegistration, isOfferStreamingEligible }) => ({
                email,
                subscriptionId,
                accountNumber,
                isUserNameSameAsEmail,
                isEligibleForRegistration,
                isOfferStreamingEligible,
            })),
            tap((transactionData) => {
                this._store.dispatch(clearPaymentInfo());
                this._store.dispatch(clearUserEnteredPassword());
                this._store.dispatch(setSuccessfulTransactionData({ transactionData }));
                this._store.dispatch(disablePageLoaderOnRouteEvent());
            }),
            mapTo(true),
            catchError((error) => {
                if (error instanceof CreditCardUnexpectedError) {
                    this._store.dispatch(newTransactionIdDueToCreditCardError());
                    return throwError('CREDIT_CARD_FAILURE' as SubmitPurchaseTargetedTransactionWorkflowErrors);
                }
                return throwError('SYSTEM' as SubmitPurchaseTargetedTransactionWorkflowErrors);
            })
        );
    }
}
