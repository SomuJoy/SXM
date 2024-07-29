import { Injectable } from '@angular/core';
import { ofType, Actions, createEffect } from '@ngrx/effects';
import { map, catchError, withLatestFrom, flatMap, concatMap, tap, switchMap } from 'rxjs/operators';
import {
    AgreementAccepted,
    ChangeStep,
    CCError,
    ServiceError,
    UpdatePurchaseAccount,
    UpdateOfferStreamingFlag,
    AddSubscription,
    UpdateIsAddSubscriptionFlag,
    UpdateRegistrationEligibilityFlag,
    ResetTransactionId,
    setSuccessfulTransactionSubscriptionId,
    UpdateIsTwoFactorAuthNeededFlag,
    UpdateMaskedPhoneNumber,
    newTransactionIdDueToCreditCardError,
    setIsRefreshAllowed,
} from '../actions/purchase.actions';
import { Observable, throwError } from 'rxjs';
import { DataPurchaseService, DataValidationService } from '@de-care/data-services';
import { Store } from '@ngrx/store';
import { purchaseSelector } from '../selectors/purchase.selectors';
import { UpdateCheckoutAccount } from '@de-care/checkout-state';

interface SubscriptionError {
    type: 'CREDIT_CARD_ERROR' | 'SYSTEM_ERROR';
    nextStepId?: number;
    originalError: unknown;
}

@Injectable()
export class AddSubscriptionEffects {
    addSubscription$ = createEffect(() =>
        this._actions$.pipe(
            ofType(AddSubscription),
            map((action) => action.payload),
            withLatestFrom(this._store.select(purchaseSelector)),
            concatMap(([payload, purchaseState]) =>
                this._dataPurchaseSrv.addSubscription(payload).pipe(
                    tap((response) => this._store.dispatch(setIsRefreshAllowed({ isRefreshAllowed: response.isRefreshAllowed }))),
                    map((addSubscriptionData) => ({
                        addSubscriptionData,
                        account: {
                            ...purchaseState.data.account,
                            email: addSubscriptionData.email,
                            subscriptionId: addSubscriptionData.subscriptionId,
                        },
                    })),
                    catchError((response) => {
                        if (this._dataPurchaseSrv.isCreditCardError(response.status, response.error.error.errorPropKey)) {
                            this._store.dispatch(newTransactionIdDueToCreditCardError());
                            return throwError({ type: 'CREDIT_CARD_ERROR', nextStepId: purchaseState.formStatus.isFlepz ? 2 : 1 } as SubscriptionError);
                        } else {
                            return throwError({ type: 'SYSTEM_ERROR', nextStepId: null, originalError: response } as SubscriptionError);
                        }
                    })
                )
            ),
            concatMap(({ addSubscriptionData, account }) =>
                this._dataValidationService.validateUserName({ userName: account.email, reuseUserName: true }).pipe(
                    map((res) => ({
                        addSubscriptionData,
                        account: {
                            ...account,
                            useEmailAsUsername: addSubscriptionData.isUserNameSameAsEmail || res.valid,
                        },
                    }))
                )
            ),
            flatMap(({ addSubscriptionData, account }) => [
                setSuccessfulTransactionSubscriptionId({ subscriptionId: addSubscriptionData.subscriptionId }),
                UpdatePurchaseAccount({ payload: account }),
                UpdateCheckoutAccount({ payload: account }),
                UpdateOfferStreamingFlag({ payload: addSubscriptionData.isOfferStreamingEligible }),
                UpdateIsAddSubscriptionFlag({ payload: true }),
                AgreementAccepted({ payload: true }),
                UpdateRegistrationEligibilityFlag({ payload: addSubscriptionData.isEligibleForRegistration }),
                UpdateIsTwoFactorAuthNeededFlag({ isTwoFactorAuthNeeded: addSubscriptionData.isTwoFactorAuthNeeded }),
                UpdateMaskedPhoneNumber({ maskedPhoneNumber: addSubscriptionData.maskedPhoneNumber }),
            ]),
            catchError((error: SubscriptionError, caught: Observable<any>) => {
                if (error.type === 'CREDIT_CARD_ERROR') {
                    this._store.dispatch(CCError({ payload: true }));
                    this._store.dispatch(ChangeStep({ payload: error.nextStepId }));
                } else {
                    this._store.dispatch(ResetTransactionId({ payload: true }));
                    this._store.dispatch(ServiceError({ payload: error.originalError }));
                }
                // To use catchError in the main Observable stream of an Effect we must have it return the caught Observable so the Effect continues to be "active".
                return caught;
            })
        )
    );

    constructor(private _actions$: Actions, private _dataPurchaseSrv: DataPurchaseService, private _store: Store, private _dataValidationService: DataValidationService) {}
}
