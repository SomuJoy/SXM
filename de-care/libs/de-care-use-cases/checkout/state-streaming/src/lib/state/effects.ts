import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadConfirmationPageData, setMrdSelectedPlanCode, loadOrganicPurchaseDataIfNotAlreadyLoadedAsync } from './public.actions';
import { flatMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { clearCheckoutCommonTransactionState, setCustomerInfo, setPaymentInfo, setSelectedPlanCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { fetchSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { collectPaymentInfo, setUserPickedAPlanCode, clearCheckoutStreamingTransactionState, collectPaymentInfoBillingAddress } from './actions';
import { Store } from '@ngrx/store';
import { getTransactionData } from './selectors';
import { LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService } from '../workflows/load-organic-purchase-data-if-not-already-loaded-workflow.service';

@Injectable()
export class Effects {
    constructor(
        private readonly _actions$: Actions,
        private readonly _store: Store,
        private readonly _loadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService: LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService
    ) {}

    collectPaymentInfo$ = createEffect(() =>
        this._actions$.pipe(
            ofType(collectPaymentInfo),
            flatMap(({ paymentInfo }) => [
                setCustomerInfo({ customerInfo: { firstName: paymentInfo.firstName, lastName: paymentInfo.lastName, phoneNumber: paymentInfo.phoneNumber } }),
                setPaymentInfo({
                    paymentInfo: {
                        serviceAddress: {
                            addressLine1: paymentInfo.addressLine1,
                            city: paymentInfo.city,
                            state: paymentInfo.state,
                            zip: paymentInfo.zip,
                            country: paymentInfo.country,
                            avsValidated: paymentInfo.avsValidated,
                        },
                        nameOnCard: paymentInfo.nameOnCard,
                        cardNumber: paymentInfo.cardNumber,
                        cardExpirationDate: paymentInfo.expirationDate,
                        cvv: paymentInfo.cvv,
                        giftCard: paymentInfo.giftCard,
                    },
                    useCardOnFile: false,
                }),
            ])
        )
    );

    collectPaymentInfoBillingAddress$ = createEffect(() =>
        this._actions$.pipe(
            ofType(collectPaymentInfoBillingAddress),
            flatMap(({ paymentInfo }) => [
                setCustomerInfo({ customerInfo: { firstName: paymentInfo.firstName, lastName: paymentInfo.lastName, phoneNumber: paymentInfo.phoneNumber } }),
                setPaymentInfo({
                    paymentInfo: {
                        billingAddress: {
                            addressLine1: paymentInfo.addressLine1,
                            city: paymentInfo.city,
                            state: paymentInfo.state,
                            zip: paymentInfo.zip,
                            country: paymentInfo.country,
                            avsValidated: paymentInfo.avsValidated,
                        },
                        nameOnCard: paymentInfo.nameOnCard,
                        cardNumber: paymentInfo.cardNumber,
                        cardExpirationDate: paymentInfo.expirationDate,
                        cvv: paymentInfo.cvv,
                        giftCard: paymentInfo.giftCard,
                    },
                    useCardOnFile: false,
                }),
            ])
        )
    );

    loadOrganicPurchaseDataAsync$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(loadOrganicPurchaseDataIfNotAlreadyLoadedAsync),
                switchMap(() => this._loadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService.build())
            ),
        { dispatch: false }
    );

    loadConfirmationPageData$ = createEffect(() =>
        this._actions$.pipe(
            ofType(loadConfirmationPageData),
            withLatestFrom(this._store.select(getTransactionData)),
            flatMap(([, transactionData]) => [
                ...(transactionData?.isEligibleForRegistration ? [fetchSecurityQuestions({ accountRegistered: false })] : []),
                pageDataFinishedLoading(),
            ])
        )
    );

    setMrdSelectedPlanCode$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setMrdSelectedPlanCode),
            flatMap(({ planCode }) => [setSelectedPlanCode({ planCode }), setUserPickedAPlanCode()])
        )
    );

    clearCheckoutStreamingTransactionState$ = createEffect(() =>
        this._actions$.pipe(
            ofType(clearCheckoutStreamingTransactionState),
            map(() => clearCheckoutCommonTransactionState())
        )
    );
}
