import { Injectable, Inject } from '@angular/core';
import { behaviorEventReactionForTransactionId } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { flatMap, map } from 'rxjs/operators';
import * as uuid from 'uuid/v4';
import { initTransactionId, newTransactionIdDueToCreditCardError, setTransactionIdForSession, setCreditCardType } from './actions';
import { collectPaymentInformation, confirmationPageReadyToShow } from './public.actions';
import { setConfirmationDataReady, captureBillingStatus } from './actions';
import { CREDIT_CARD_TYPE_IDENTIFIER, CreditCardTypeIdentifier } from '@de-care/shared/credit-card-identifier';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { behaviorEventReactionForBillingStatus } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(
        private readonly _actions$: Actions,
        private readonly _store: Store,
        @Inject(CREDIT_CARD_TYPE_IDENTIFIER) private readonly _creditCardTypeIdentifierService: CreditCardTypeIdentifier
    ) {}

    initTransactionId$ = createEffect(() =>
        this._actions$.pipe(
            ofType(initTransactionId),
            flatMap(() => {
                const transactionIdForSession = `OAC-${uuid()}`;
                return [setTransactionIdForSession({ transactionIdForSession }), behaviorEventReactionForTransactionId({ transactionId: transactionIdForSession })];
            })
        )
    );

    newTransactionIdDueToCreditCardError$ = createEffect(() =>
        this._actions$.pipe(
            ofType(newTransactionIdDueToCreditCardError),
            map(() => initTransactionId())
        )
    );

    identifyCardType$ = createEffect(() =>
        this._actions$.pipe(
            ofType(collectPaymentInformation),
            map((info) => this._creditCardTypeIdentifierService.identifyType(info?.paymentInformation?.cardNumber)),
            map((cardInfo) => setCreditCardType({ cardType: cardInfo.type }))
        )
    );

    paymentProcessSucessful$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setCreditCardType),
            map(() => setConfirmationDataReady())
        )
    );

    pageReady$ = createEffect(() =>
        this._actions$.pipe(
            ofType(confirmationPageReadyToShow),
            map(() => pageDataFinishedLoading())
        )
    );

    captureBillingStatusEffect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(captureBillingStatus),
            map((action) => ({ billingSummary: action?.billingSummary, subscriptions: action?.subscriptions })),
            map((accountInfo) => this._getAndCaptureBillingStatus(accountInfo))
        )
    );

    private _getAndCaptureBillingStatus(accountInfo: any) {
        const billingSummary = accountInfo?.billingSummary;
        const containsSuspendedSubscription =
            accountInfo?.subscriptions?.map((subscription) => subscription?.hasInactiveServiceDueToNonPay)?.some((inactive) => inactive) || false;
        let paymentType = '';
        billingSummary?.paymentType?.toLowerCase() === 'invoice' ? (paymentType = 'INV_') : (paymentType = 'CC_');

        const billingStatus = containsSuspendedSubscription
            ? paymentType + 'SUSPENDED'
            : billingSummary?.amountDue && billingSummary?.nextPaymentAmount
            ? paymentType + 'CURRENT_NEXT'
            : billingSummary?.amountDue && !billingSummary?.nextPaymentAmount
            ? paymentType + 'CURRENT'
            : !billingSummary?.amountDue && billingSummary?.nextPaymentAmount
            ? paymentType + 'NEXT'
            : paymentType + 'NONE';
        return behaviorEventReactionForBillingStatus({ billingStatus });
    }
}
