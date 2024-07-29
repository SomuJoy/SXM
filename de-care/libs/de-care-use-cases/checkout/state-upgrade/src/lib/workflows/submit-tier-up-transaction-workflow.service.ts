import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, take, tap } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { AddSubscriptionWorkflowService } from '@de-care/domains/purchase/state-add-subscription';
import { ChangeSubscriptionWorkflowService, ChangeSubscriptionWorkflowServiceError } from '@de-care/domains/purchase/state-change-subscription';
import { behaviorEventReactionGiftCardUsedDuringPurchase } from '@de-care/shared/state-behavior-events';
import { clearPaymentInfo, newTransactionIdDueToCreditCardError, setIsRefreshAllowed } from '@de-care/de-care-use-cases/checkout/state-common';
import { disablePageLoaderOnRouteEvent } from '@de-care/de-care/shared/state-loading';
import { CreditCardUnexpectedError } from '@de-care/shared/de-microservices-common';
import { getPayloadForPurchaseTransaction, getSelectedRadioIsClosed } from '../state/selectors';
import { setSuccessfulTransactionData } from '../state/actions';
import { TranslateService } from '@ngx-translate/core';

export type SubmitTierUpTransactionWorkflowServiceError = 'SYSTEM' | 'CREDIT_CARD_FAILURE';

@Injectable({ providedIn: 'root' })
export class SubmitTierUpTransactionWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _changeSubscriptionWorkflowService: ChangeSubscriptionWorkflowService,
        private readonly _addSubscriptionWorkflowService: AddSubscriptionWorkflowService,
        private _translateService: TranslateService
    ) {}

    build(): Observable<boolean> {
        return combineLatest([this._store.select(getPayloadForPurchaseTransaction), this._store.select(getSelectedRadioIsClosed)]).pipe(
            take(1),
            concatMap(([request, radioIsClosed]) => {
                const stream$ = radioIsClosed
                    ? this._addSubscriptionWorkflowService.build({ ...request, languagePreference: this._translateService.currentLang, subscriptionId: undefined })
                    : this._changeSubscriptionWorkflowService.build({ ...request, languagePreference: this._translateService.currentLang });
                return stream$.pipe(
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
                subscriptionId: +subscriptionId,
                accountNumber,
                isUserNameSameAsEmail,
                isEligibleForRegistration,
                isOfferStreamingEligible,
            })),
            tap((transactionData) => {
                this._store.dispatch(clearPaymentInfo());
                this._store.dispatch(setSuccessfulTransactionData({ transactionData }));
                this._store.dispatch(disablePageLoaderOnRouteEvent());
            }),
            mapTo(true),
            catchError((error: ChangeSubscriptionWorkflowServiceError | CreditCardUnexpectedError) => {
                if (error === 'CREDIT_CARD_FAILURE' || error instanceof CreditCardUnexpectedError) {
                    this._store.dispatch(newTransactionIdDueToCreditCardError());
                    return throwError('CREDIT_CARD_FAILURE' as SubmitTierUpTransactionWorkflowServiceError);
                }
                return throwError('SYSTEM' as SubmitTierUpTransactionWorkflowServiceError);
            })
        );
    }
}
