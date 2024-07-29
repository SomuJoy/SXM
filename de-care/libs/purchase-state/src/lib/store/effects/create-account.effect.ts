import { Injectable } from '@angular/core';
import { ofType, Actions, createEffect } from '@ngrx/effects';
import { map, catchError, withLatestFrom, flatMap, concatMap, tap } from 'rxjs/operators';
import {
    AgreementAccepted,
    ChangeStep,
    CCError,
    ServiceError,
    UpdateOfferStreamingFlag,
    CreateAccount,
    UpdatePurchaseAccount,
    UpdateRegistrationEligibilityFlag,
    ResetTransactionId,
    setSuccessfulTransactionSubscriptionId,
    UpdateIsTwoFactorAuthNeededFlag,
    UpdateMaskedPhoneNumber,
    setIsRefreshAllowed,
    PasswordInvalidError,
    PasswordContainsPiiDataError,
} from '../actions/purchase.actions';
import { of, iif, throwError, Observable } from 'rxjs';
import {
    DataPurchaseService,
    DataLayerDataTypeEnum,
    ErrorTypeEnum,
    DataValidationService,
    getRadioIdFromAccount,
    AccountModel,
    SubscriptionModel,
    PlanTypeEnum,
    SubscriptionStreamingServiceStatus,
    SubscriptionStatusType,
} from '@de-care/data-services';
import { Action, Store } from '@ngrx/store';
import { purchaseSelector } from '../selectors/purchase.selectors';
import { UpdateCheckoutAccount } from '@de-care/checkout-state';
import { DataLayerService, FrontEndErrorModel, FrontEndErrorEnum } from '@de-care/data-layer';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';

interface SubscriptionError {
    type: 'CREDIT_CARD_ERROR' | 'SYSTEM_ERROR' | 'PASSWORD_INVALID' | 'PASSWORD_HAS_PII_DATA';
    formStepNumberForErrorRedirects: number;
    originalError: unknown;
}

@Injectable()
export class CreateAccountEffects {
    createAccount$ = createEffect(() =>
        this._actions$.pipe(
            ofType(CreateAccount),
            map((action) => action.payload),
            withLatestFrom(this._store.select(purchaseSelector)),
            concatMap(([payload, purchaseState]) =>
                this._dataPurchaseSrv.createAccount(payload).pipe(
                    tap((response) => this._store.dispatch(setIsRefreshAllowed({ isRefreshAllowed: response.isRefreshAllowed }))),
                    map((createAccountData) => ({
                        hasUserCredentials: !!payload.streamingInfo,
                        account: purchaseState.data.account,
                        createAccountData,
                        radioId: getRadioIdFromAccount(purchaseState.data.account),
                    })),
                    catchError((response) => {
                        if (this._dataPurchaseSrv.isCreditCardError(response.status, response.error.error.errorPropKey)) {
                            return throwError({
                                type: 'CREDIT_CARD_ERROR',
                                formStepNumberForErrorRedirects: purchaseState.formStatus.formStepNumberForErrorRedirects,
                            } as SubscriptionError);
                        } else if (response.error?.error?.errorCode === 'PASSWORD_HAS_PII_DATA') {
                            return throwError({
                                type: 'PASSWORD_HAS_PII_DATA',
                                formStepNumberForErrorRedirects: 1,
                            } as SubscriptionError);
                        } else if (response.error?.error?.errorCode === 'PASSWORD_INVALID') {
                            return throwError({
                                type: 'PASSWORD_INVALID',
                                formStepNumberForErrorRedirects: 1,
                            } as SubscriptionError);
                        } else {
                            return throwError({ type: 'SYSTEM_ERROR', formStepNumberForErrorRedirects: null, originalError: response } as SubscriptionError);
                        }
                    })
                )
            ),
            concatMap((createAccountResults) =>
                iif(
                    () => !!createAccountResults.radioId,
                    this._nonPiiSrv.build({ radioId: createAccountResults.radioId }).pipe(
                        tap((account) => {
                            account.email = createAccountResults.createAccountData.email;
                            account.subscriptionId = createAccountResults.createAccountData.subscriptionId;
                            account.isNewAccount = true;
                        }),
                        map((account) => ({
                            createAccountData: createAccountResults.createAccountData,
                            account,
                            hasUserCredentials: createAccountResults.hasUserCredentials,
                            validateUsername: true,
                        }))
                    ),
                    this._nonPiiSrv.build({ accountNumber: createAccountResults.createAccountData.accountNumber }).pipe(
                        map((accountData) => ({
                            createAccountData: createAccountResults.createAccountData,
                            account: {
                                ...createAccountResults.account,
                                subscriptions: accountData.subscriptions.map((sbs) => ({
                                    subscriptionId: null,
                                    id: sbs.id,
                                    followonPlans: sbs.followonPlans,
                                    plans: sbs.plans.map((pl) => ({
                                        code: pl.code,
                                        packageName: pl.packageName,
                                        termLength: pl.termLength,
                                        endDate: pl.endDate,
                                        type: pl.type as PlanTypeEnum,
                                    })),
                                    streamingService: {
                                        ...sbs.streamingService,
                                        status: sbs.status as SubscriptionStreamingServiceStatus,
                                    },
                                    radioService: sbs.radioService,
                                    status: sbs.status as SubscriptionStatusType,
                                })),
                                hasUserCredentials: createAccountResults.hasUserCredentials,
                                email: createAccountResults.createAccountData.email,
                                subscriptionId: createAccountResults.createAccountData.subscriptionId,
                            },
                            hasUserCredentials: createAccountResults.hasUserCredentials,
                            validateUsername: false,
                        }))
                    )
                )
            ),
            concatMap((data) =>
                iif(
                    () => data.validateUsername,
                    this._dataValidationService.validateUserName({ userName: data.account.email, reuseUserName: true }).pipe(
                        // The libs/shared/validation/src/lib/functions/registration-helpers.ts function has logic that mutates the Account object (not desired)
                        //      so we need to do that here until we can figure out how to resolve this
                        tap((res) => {
                            data.account.useEmailAsUsername = data.createAccountData.isUserNameSameAsEmail || res.valid;
                        }),
                        catchError(() => {
                            data.account.useEmailAsUsername = false;
                            return of(data);
                        }),
                        map(() => data)
                    ),
                    of(data)
                )
            ),
            tap(({ account }) => {
                this._logSubscriptionsToDataLayer(account.subscriptions);
            }),
            // TODO: add validate username if needed
            flatMap(({ account, createAccountData }) =>
                this._buildReturnActions(
                    account,
                    createAccountData.isOfferStreamingEligible,
                    createAccountData.isEligibleForRegistration,
                    createAccountData.isTwoFactorAuthNeeded,
                    createAccountData.maskedPhoneNumber,
                    createAccountData.subscriptionId
                )
            ),
            catchError((error: SubscriptionError, caught: Observable<any>) => {
                if (error.type === 'CREDIT_CARD_ERROR') {
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.EventCCNotAuthorized));
                    this._store.dispatch(CCError({ payload: true }));
                    this._store.dispatch(ChangeStep({ payload: error.formStepNumberForErrorRedirects }));
                } else if (error.type === 'PASSWORD_HAS_PII_DATA') {
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.NewAccountUnableToCreate));
                    this._store.dispatch(ResetTransactionId({ payload: true }));
                    this._store.dispatch(PasswordContainsPiiDataError({ payload: true }));
                    this._store.dispatch(ChangeStep({ payload: error.formStepNumberForErrorRedirects }));
                } else if (error.type === 'PASSWORD_INVALID') {
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.NewAccountUnableToCreate));
                    this._store.dispatch(ResetTransactionId({ payload: true }));
                    this._store.dispatch(PasswordInvalidError({ payload: true }));
                    this._store.dispatch(ChangeStep({ payload: error.formStepNumberForErrorRedirects }));
                } else {
                    this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.NewAccountUnableToCreate));
                    this._store.dispatch(ResetTransactionId({ payload: true }));
                    this._store.dispatch(ServiceError({ payload: error.originalError }));
                }
                // To use catchError in the main Observable stream of an Effect we must have it return the caught Observable so the Effect continues to be "active".
                return caught;
            })
        )
    );

    constructor(
        private _actions$: Actions,
        private _dataPurchaseSrv: DataPurchaseService,
        private _store: Store,
        private _nonPiiSrv: NonPiiLookupWorkflow,
        private _dataLayerSrv: DataLayerService,
        private _dataValidationService: DataValidationService
    ) {}

    private _buildReturnActions(
        account: AccountModel,
        isOfferStreamingEligible: boolean,
        isEligibleForRegistration: boolean,
        isTwoFactorAuthNeeded: boolean,
        maskedPhoneNumber: string,
        subscriptionId: string
    ): Action[] {
        return [
            setSuccessfulTransactionSubscriptionId({ subscriptionId }),
            UpdatePurchaseAccount({ payload: account }),
            UpdateCheckoutAccount({ payload: account }),
            UpdateOfferStreamingFlag({ payload: isOfferStreamingEligible }),
            AgreementAccepted({ payload: true }),
            UpdateRegistrationEligibilityFlag({ payload: isEligibleForRegistration }),
            UpdateIsTwoFactorAuthNeededFlag({ isTwoFactorAuthNeeded }),
            UpdateMaskedPhoneNumber({ maskedPhoneNumber }),
        ];
    }

    private _logSubscriptionsToDataLayer(subscriptions): void {
        if (subscriptions && subscriptions.length > 0) {
            const deviceInfoObj: any = this._dataLayerSrv.getData(DataLayerDataTypeEnum.DeviceInfo);
            const subscription: SubscriptionModel = subscriptions[0];
            deviceInfoObj.serviceId = subscription.radioService && subscription.radioService.id;
            if (!deviceInfoObj.serviceId && subscription.streamingService && subscription.streamingService.id) {
                deviceInfoObj.serviceId = subscription.streamingService.id;
            }
            this._dataLayerSrv.update(DataLayerDataTypeEnum.DeviceInfo, deviceInfoObj);
        }
    }
}
