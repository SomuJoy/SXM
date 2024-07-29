import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { disablePageLoaderOnRouteEvent } from '@de-care/de-care/shared/state-loading';
import { CreateNewAccountWithSubscriptionWorkflowService } from '@de-care/domains/subscriptions/state-new-account';
import { getAmexOfferRedeemedData, getPayloadForPurchaseTransaction } from '../state/selectors';
import { setSuccessfulTransactionData } from '../state/actions';
import { CreditCardUnexpectedError, PasswordUnexpectedError } from '@de-care/shared/de-microservices-common';
import { LoadAccountFromAccountDataWorkflow } from '@de-care/domains/account/state-account';
import { clearUserEnteredPassword, clearPaymentInfo, newTransactionIdDueToCreditCardError, setIsRefreshAllowed } from '@de-care/de-care-use-cases/checkout/state-common';
import { getPvtTime } from '@de-care/domains/utility/state-environment-info';
import { behaviorEventErrorFromSystem, behaviorEventReactionGiftCardUsedDuringPurchase } from '@de-care/shared/state-behavior-events';
import { AmexError, AmexService } from '@de-care/shared/amex-sdk';
import { TranslateService } from '@ngx-translate/core';
import { ChangeSubscriptionWorkflowService } from '@de-care/domains/purchase/state-change-subscription';

export type SubmitPurchaseOrganicTransactionWorkflowErrors = 'CREDIT_CARD_FAILURE' | 'PASSWORD_POLICY_FAILURE' | 'PASSWORD_HAS_PII_DATA_ERROR' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class SubmitPurchaseOrganicTransactionWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _createNewAccountWithSubscriptionWorkflowService: CreateNewAccountWithSubscriptionWorkflowService,
        private readonly _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow,
        private readonly _amexService: AmexService,
        private readonly _translationService: TranslateService,
        private readonly _changeSubscriptionWorkflowService: ChangeSubscriptionWorkflowService
    ) {}

    build(): Observable<boolean> {
        return this._store.select(getPayloadForPurchaseTransaction).pipe(
            withLatestFrom(this._store.select(getAmexOfferRedeemedData)),
            take(1),
            concatMap(([request, amexOfferRedeemedData]) => {
                let obs$;
                if (request.subscriptionId) {
                    obs$ = this._changeSubscriptionWorkflowService.build(request, false);
                } else {
                    obs$ = this._createNewAccountWithSubscriptionWorkflowService.build({ ...request, languagePreference: this._translationService.currentLang });
                }
                return obs$.pipe(
                    tap((response: any) => this._store.dispatch(setIsRefreshAllowed({ isRefreshAllowed: response?.isRefreshAllowed }))),
                    tap(() => {
                        if (request.paymentInfo.giftCards.some((giftCard) => !!giftCard)) {
                            this._store.dispatch(behaviorEventReactionGiftCardUsedDuringPurchase());
                        }
                    }),
                    concatMap((accountInfo) => {
                        if (amexOfferRedeemedData) {
                            //create a selector with this object, if it is null then dont call redeemoffer
                            return this._amexService.redeemOffer(amexOfferRedeemedData).pipe(
                                catchError((e: AmexError) => {
                                    if (e.type === 'SYSTEM') {
                                        const error = e.error as Error;
                                        this._store.dispatch(
                                            behaviorEventErrorFromSystem({
                                                message: error.message,
                                            })
                                        );
                                    }
                                    // we don't want to redirect to bummer page
                                    return of(accountInfo);
                                }),
                                mapTo(accountInfo)
                            );
                        }
                        return of(accountInfo);
                    })
                );
            }),
            map(({ subscriptionId, accountNumber, isUserNameSameAsEmail, isEligibleForRegistration, isOfferStreamingEligible }) => ({
                subscriptionId,
                accountNumber,
                isUserNameSameAsEmail,
                isEligibleForRegistration,
                isOfferStreamingEligible,
            })),
            withLatestFrom(this._store.select(getPvtTime)),
            concatMap(([transactionData, pvtTime]) =>
                this._loadAccountFromAccountDataWorkflow.build({ accountNumber: transactionData.accountNumber, pvtTime }).pipe(mapTo(transactionData))
            ),
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
                    return throwError('CREDIT_CARD_FAILURE' as SubmitPurchaseOrganicTransactionWorkflowErrors);
                }
                if (error instanceof PasswordUnexpectedError && error?.message === 'Unexpected Password Error') {
                    return throwError('PASSWORD_POLICY_FAILURE' as SubmitPurchaseOrganicTransactionWorkflowErrors);
                }
                if (error instanceof PasswordUnexpectedError && error?.message === 'Password Has Pii Data Error') {
                    return throwError('PASSWORD_HAS_PII_DATA_ERROR' as SubmitPurchaseOrganicTransactionWorkflowErrors);
                }
                return throwError('SYSTEM' as SubmitPurchaseOrganicTransactionWorkflowErrors);
            })
        );
    }
}
