import { Injectable } from '@angular/core';
import { ofType, Actions, createEffect } from '@ngrx/effects';
import { map, catchError, withLatestFrom, flatMap, concatMap, tap } from 'rxjs/operators';
import {
    AgreementAccepted,
    ChangeStep,
    ChangeSubscription,
    CCError,
    ServiceError,
    UpdatePurchaseAccount,
    UpdateOfferStreamingFlag,
    UpdateRegistrationEligibilityFlag,
    ResetTransactionId,
    setSuccessfulTransactionSubscriptionId,
    UpdateIsTwoFactorAuthNeededFlag,
    UpdateMaskedPhoneNumber,
    newTransactionIdDueToCreditCardError,
    setIsRefreshAllowed,
} from '../actions/purchase.actions';
import { iif, Observable, of, throwError } from 'rxjs';
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
export class ChangeSubscriptionEffects {
    effect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ChangeSubscription),
            map(({ payload }) => payload),
            withLatestFrom(this._store.select(purchaseSelector)),
            map(([payload, purchaseState]) => ({ payload, account: purchaseState.data.account, isFlepz: purchaseState.formStatus.isFlepz })),
            concatMap((requestData) =>
                this._dataPurchaseSrv.changeSubscription(requestData.payload).pipe(
                    tap((response) => this._store.dispatch(setIsRefreshAllowed({ isRefreshAllowed: response.isRefreshAllowed }))),
                    map((data) => ({
                        data,
                        account: {
                            ...requestData.account,
                            email: !requestData.account.email ? data.email : requestData.account.email,
                        },
                        validateUsernamePayload: {
                            userName: data.email,
                            reuseUserName: true,
                        },
                    })),
                    catchError((response) => {
                        if (this._dataPurchaseSrv.isCreditCardError(response.status, response.error.error.errorPropKey)) {
                            this._store.dispatch(newTransactionIdDueToCreditCardError());
                            return throwError({ type: 'CREDIT_CARD_ERROR', nextStepId: requestData.isFlepz ? 2 : 1 } as SubscriptionError);
                        } else {
                            return throwError({ type: 'SYSTEM_ERROR', nextStepId: null, originalError: response } as SubscriptionError);
                        }
                    })
                )
            ),
            concatMap(({ data, account, validateUsernamePayload }) =>
                iif(
                    () => {
                        if (account && account.accountProfile && account.accountProfile.accountRegistered) {
                            return true;
                        }
                        return data.isUserNameSameAsEmail;
                    },
                    of({ data, account, useEmailAsUsername: data.isUserNameSameAsEmail }),
                    this._dataValidationService.validateUserName(validateUsernamePayload).pipe(
                        map((res) => ({
                            data,
                            account,
                            useEmailAsUsername: data.isUserNameSameAsEmail || res.valid,
                        }))
                    )
                )
            ),
            // The libs/shared/validation/src/lib/functions/registration-helpers.ts function has logic that mutates the Account object (not desired)
            //      so we need to do that here until we can figure out how to resolve this
            tap(({ account, useEmailAsUsername }) => {
                account.useEmailAsUsername = useEmailAsUsername;
            }),
            flatMap(({ data, account }) => {
                return [
                    setSuccessfulTransactionSubscriptionId({ subscriptionId: data.subscriptionId }),
                    UpdatePurchaseAccount({ payload: account }),
                    UpdateCheckoutAccount({ payload: account }),
                    UpdateOfferStreamingFlag({ payload: data.isOfferStreamingEligible }),
                    AgreementAccepted({ payload: true }),
                    UpdateRegistrationEligibilityFlag({ payload: data.isEligibleForRegistration }),
                    UpdateIsTwoFactorAuthNeededFlag({ isTwoFactorAuthNeeded: data.isTwoFactorAuthNeeded }),
                    UpdateMaskedPhoneNumber({ maskedPhoneNumber: data.maskedPhoneNumber }),
                ];
            }),
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
