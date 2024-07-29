import { Injectable } from '@angular/core';

import { Store, Action, select } from '@ngrx/store';
import { Effect, ofType, Actions, createEffect } from '@ngrx/effects';

import { Observable, forkJoin, of, from } from 'rxjs';
import { map, switchMap, concatMap, withLatestFrom, catchError, tap, flatMap } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

import {
    DataOfferService,
    DataLayerDataTypeEnum,
    AccountModel,
    OfferModel,
    PackageModel,
    SubscriptionModel,
    RadioStatusEnum,
    AuthenticationTypeEnum,
    CustomerInfoData,
    getSubscriptionIdFromAccount,
    getRadioIdFromAccount,
    OfferCustomerDataModel,
} from '@de-care/data-services';
import { DataLayerService } from '@de-care/data-layer';

import { getData, getFormStep, getUpsellCode, getServiceAddress, getPaymentInfoEmail, getPlatformChangedFlag, getSelectedOfferOrOffer } from '../selectors/purchase.selectors';
import {
    PopulateQuote,
    LoadQuote,
    ChangeStep,
    LoadFlepzData,
    LoadFlepzDataSuccess,
    GetUpsells,
    ServiceError,
    VerifyFlepzAccount,
    SetPlatformChangedFlag,
    LoadSelectedOffer,
    LoadQuoteFromUpdatedOffer,
    SetPlatformChangeUpsellDeferred,
    LoadSelectedChoicePlan,
    newTransactionIdDueToCreditCardError,
    setTransactionId,
} from '../actions/purchase.actions';

import {
    LoadCheckoutFlepzAccount,
    ServiceError as ErrorRedirect,
    LoadCheckoutClosedRadioInfo,
    ClearUpsell,
    getIsStudentFlow,
    getRenewalPlanCode,
    CheckRTCFlow,
    resetDefaultOfferBehavior,
    SetSelectedOfferChoicePlan,
} from '@de-care/checkout-state';
import { UserSettingsService, SettingsService } from '@de-care/settings';
// TODO: move the EnvironmentInfoService out off app/core to a lib
import { getPvtTime } from '@de-care/domains/utility/state-environment-info';
import { behaviorEventErrorFromBusinessLogic, behaviorEventReactionForTransactionId } from '@de-care/shared/state-behavior-events';
import { selectFirstFollowOnOfferPlanCode } from '@de-care/domains/offers/state-follow-on-offers';
import { CustomerTypeEnum, inTrialPostTrialSelfPayCustomerType } from '@de-care/domains/account/state-account';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { getQuote, LoadQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';

@Injectable()
export class DataEffects {
    private _comingAccount: AccountModel;
    private _comingOffer: OfferModel;
    private _isFlepz: boolean;
    private _accountNumber: string;
    private _isStudent;

    constructor(
        private _actions$: Actions,
        private _dataOfferSvc: DataOfferService,
        private _dataLayerSrv: DataLayerService,
        private _store$: Store<any>,
        private _settingsService: SettingsService,
        private _userSettingsService: UserSettingsService,
        private readonly _loadQuoteWorkflowService: LoadQuoteWorkflowService
    ) {}

    loadFlepzAccount$ = createEffect(() =>
        this._actions$.pipe(
            ofType(LoadFlepzData),
            concatMap((action) => {
                this._accountNumber = action.payload.accountNumber;
                if (action.payload.account) {
                    return forkJoin([of(action.payload.account), of(action)]);
                } else {
                    throw new Error('No account provided for LoadFlepzData');
                }
            }),
            concatMap(([account, action]) => {
                this._comingAccount = account;
                const state = this._comingAccount.serviceAddress && this._comingAccount.serviceAddress.state;
                return from([
                    VerifyFlepzAccount({
                        payload: {
                            account: account,
                            loadUpsells: !action.payload.platformChanged || action.payload.deferredUpsell === true,
                            stepNumber: action.payload.stepNumber,
                            retrieveFallbackOffer: false,
                            state: this._settingsService.isCanadaMode && state,
                        },
                    }),
                    SetPlatformChangedFlag({ payload: action.payload.platformChanged }),
                    SetPlatformChangeUpsellDeferred({ upsellDeferred: action.payload.deferredUpsell === true }),
                ]);
            }),
            catchError((e) => {
                return of(ErrorRedirect({ payload: e }));
            })
        )
    );

    verifyFlepzAccount$ = createEffect(() =>
        this._actions$.pipe(
            ofType(VerifyFlepzAccount),
            tap((action) => {
                if (action.payload.state) {
                    this._userSettingsService.setSelectedCanadianProvince(action.payload.state);
                    this._userSettingsService.setProvinceSelectionDisabled(true);
                }
            }),

            // TODO: Figure out why this filter() is here. This filter() operator breaks the typing for createEffect.
            //       It is hard to identify if this is ever being used (the false scenario). We have Cypress coverage that confirms
            //       the active subscription messaging is working without this code runnning.

            // filter(([action, dataState]) => {
            //     const account = action.payload.account;
            //     if (this._dataAccountSvc.accountHasActiveSubscription(account.subscriptions[0])) {
            //         this._store$.dispatch(
            //             SetAccountActiveSubscription({
            //                 payload: {
            //                     subscription: account.subscriptions[0],
            //                     programCode: dataState.programCode,
            //                 },
            //             })
            //         );
            //         return false;
            //     }
            //     return true;
            // }),

            withLatestFrom(this._store$.select(getData), this._userSettingsService.selectedCanadianProvince$, this._store$.pipe(select(getIsStudentFlow))),
            concatMap(([action, dataState, province, isStudent]) => {
                const account = action.payload.account;
                const radioId = getRadioIdFromAccount(account);
                const marketingPromoCode = dataState.marketingPromoCode || undefined;
                let offerCustomerData: OfferCustomerDataModel;
                if (this._settingsService.isCanadaMode) {
                    const programCode = dataState.programCode || undefined;
                    offerCustomerData = {
                        ...(radioId && { radioId }),
                        marketingPromoCode,
                        programCode,
                    };
                } else {
                    offerCustomerData = {
                        radioId: radioId,
                        programCode: dataState.programCode,
                        marketingPromoCode,
                    };
                }

                if (this._settingsService.isCanadaMode) {
                    offerCustomerData.province = province;
                }

                let offer$: Observable<OfferModel>;

                if (action.payload.isStreaming && account.isNewAccount && action.payload.state) {
                    offerCustomerData.streaming = action.payload.isStreaming;
                    offer$ = this._dataOfferSvc.customer({ ...offerCustomerData, ...(isStudent ? { student: true } : null) });
                } else if (action.payload.isStreaming && action.payload.state) {
                    offerCustomerData.streaming = action.payload.isStreaming;
                    offerCustomerData.subscriptionId = getSubscriptionIdFromAccount(account);
                    offer$ = this._dataOfferSvc.customer(offerCustomerData);
                } else {
                    offer$ = account.isNewAccount ? this._dataOfferSvc.customer(offerCustomerData) : this._dataOfferSvc.customer(offerCustomerData);
                }

                return forkJoin([offer$, of(account), of(action)]);
            }),
            withLatestFrom(this._store$.select(getData)),
            concatMap(([[offer, account, action], dataState]) => {
                const presentedPackage = dataState.offer?.offers?.[0];

                // TODO: consider changing this to return the account and offer in the observable stream instead of storing in the service state
                //       as it can cause potential race conditions. So something like:
                //           return of({account, offer})
                //       after any needed package description update is done
                this._comingAccount = account;
                this._comingOffer = offer;
                const comingPackage = offer.offers[0];

                this._buildDataLayerPageInfo4OfferRedirect();
                this._dataLayerSrv.update(DataLayerDataTypeEnum.OfferData, offer);

                // If presented package packageName is the same as coming package then we can use the description from the presented offer and not need to load it
                if (presentedPackage && comingPackage.packageName === presentedPackage.packageName && !comingPackage.description) {
                    comingPackage.description = presentedPackage.description;
                }
                this._isFlepz = true;
                return of(action);
            }),
            withLatestFrom(
                this._store$.select(getUpsellCode),
                this._store$.select(getData),
                this._store$.select(getIsStudentFlow),
                this._store$.select(getPvtTime),
                this._store$.pipe(select(getNormalizedQueryParams))
            ),
            switchMap(([action, upsellCode, dataState, stateIsStudent, pvtTime, { renewalcode: renewalCode }]) => {
                const hasSubscriptions = this._comingAccount.subscriptions && this._comingAccount.subscriptions.length > 0;
                this._isStudent = stateIsStudent;
                if (hasSubscriptions) {
                    this._buildDataLayerPlanInfo();
                }
                this._buildDataLayerDeviceInfo();
                this._buildDataLayerCustomerInfo(pvtTime);
                this._dataLayerSrv.update(DataLayerDataTypeEnum.AccountData, this._comingAccount);
                this._dataLayerSrv.update(DataLayerDataTypeEnum.OfferData, this._comingOffer);
                const planCode = this._comingOffer.offers[0].planCode;
                if (!this._comingAccount.isNewAccount && this._settingsService.isCanadaMode) {
                    this._userSettingsService.setProvinceSelectionDisabled(true);
                }
                return [
                    LoadCheckoutFlepzAccount({ payload: { account: this._comingAccount, offer: this._comingOffer } }),
                    ...(action.payload.loadUpsells ? [ClearUpsell()] : []),
                    LoadFlepzDataSuccess({ payload: { offer: this._comingOffer, programCode: dataState.programCode, account: this._comingAccount } }),
                    ...((action.payload.isStreaming && action.payload.account.isNewAccount && action.payload.state && [LoadSelectedOffer({ payload: this._comingOffer })]) ||
                        []),
                    ...(action.payload.loadUpsells && upsellCode
                        ? [GetUpsells({ payload: { planCode, upsellCode, retrieveFallbackOffer: false, streaming: action.payload.isStreaming } })]
                        : []),
                    ...(action.payload.stepNumber ? [ChangeStep({ payload: action.payload.stepNumber + 1 })] : []),
                    resetDefaultOfferBehavior(),
                    CheckRTCFlow({
                        payload: {
                            leadOffer: this._comingOffer,
                            params: {
                                radioId: getRadioIdFromAccount(this._comingAccount),
                                planCode: this._comingOffer.offers[0].planCode,
                                ...(!!renewalCode && { renewalCode }),
                            },
                        },
                    }),
                ];
            }),
            catchError((e) => {
                const actions: Action[] = [];
                if (e.message === 'closed radio') {
                    actions.push(
                        LoadCheckoutClosedRadioInfo({
                            payload: {
                                account: this._comingAccount,
                                accountNumber: this._accountNumber,
                            },
                        })
                    );
                }
                actions.push(ErrorRedirect({ payload: e }));
                return from(actions);
            })
        )
    );

    populateQuote$ = createEffect(() =>
        this._actions$.pipe(
            ofType(LoadQuote),
            map((action) => action.payload),
            withLatestFrom(this._store$.select(getFormStep), this._store$.select(getServiceAddress), this._store$.select(getPaymentInfoEmail), this._store$.select(getData)),
            switchMap(([payload, currentStep, address, email, data]) => {
                if (data.account.isNewAccount) {
                    payload.serviceAddress = {
                        streetAddress: address.addressLine1,
                        city: address.city,
                        state: address.state,
                        postalCode: address.zip,
                        country: this._settingsService.settings.country.toUpperCase(),
                    };
                }
                payload.subscriptionId = getSubscriptionIdFromAccount(data.account);
                return this._loadQuoteWorkflowService.build(payload).pipe(
                    withLatestFrom(this._store$.select(getQuote)),
                    switchMap(([, res]) => {
                        // this._dataLayerSrv.update(DataLayerDataTypeEnum.QuoteData, res);
                        return [PopulateQuote({ payload: res as any }), ChangeStep({ payload: currentStep + 1 })];
                    }),
                    catchError((error) => {
                        return of(ServiceError({ payload: error }));
                    })
                );
            })
        )
    );

    loadQuoteWithSeletedOffer$ = createEffect(() =>
        this._actions$.pipe(
            ofType(LoadQuoteFromUpdatedOffer),
            map((action) => action.payload),
            withLatestFrom(
                this._store$.pipe(select(getSelectedOfferOrOffer)),
                this._store$.pipe(select(getPlatformChangedFlag)),
                this._store$.pipe(select(getRenewalPlanCode)),
                this._store$.pipe(select(selectFirstFollowOnOfferPlanCode))
            ),
            map(([payload, offer, isPlatformChanged, rtcPlanCode, firstFollowOnOfferPlanCode]) => {
                const planCode = this._dataOfferSvc.getPlanCode(offer);
                if (!isPlatformChanged && payload.upgrade && payload.upgrade.length > 0) {
                    return ChangeStep({ payload: payload.formStep + 1 });
                } else {
                    const radioId = getRadioIdFromAccount(payload.account);
                    return LoadQuote({
                        payload: {
                            planCodes: [planCode],
                            radioId,
                            renewalPlanCode: rtcPlanCode,
                            ...(!!firstFollowOnOfferPlanCode ? { followOnPlanCodes: [firstFollowOnOfferPlanCode] } : {}),
                        },
                    });
                }
            })
        )
    );

    syncOfferDataPurchaseWithCheckout$ = createEffect(() =>
        this._actions$.pipe(
            ofType(LoadSelectedChoicePlan),
            map((action) => action.payload),
            map((payload) => SetSelectedOfferChoicePlan({ payload }))
        )
    );

    newTransactionIdDueToCreditCardError$ = createEffect(() =>
        this._actions$.pipe(
            ofType(newTransactionIdDueToCreditCardError),
            flatMap(() => {
                const transactionId = `OAC-${uuid()}`;
                return [setTransactionId({ transactionId }), behaviorEventReactionForTransactionId({ transactionId })];
            })
        )
    );

    // TODO: Move this logic into domain offers state-offers effect that can run after setOffers
    private _buildDataLayerPageInfo4OfferRedirect() {
        const isFallback: boolean = this._comingOffer.offers[0].fallback;

        if (isFallback) {
            this._store$.dispatch(behaviorEventErrorFromBusinessLogic({ message: 'Program Code invalid' }));
        }
    }

    private _buildDataLayerPlanInfo(): void {
        const subscription: SubscriptionModel = this._comingAccount.subscriptions[0];
        if (this._comingAccount && subscription.plans[0]) {
            const serviceStartDate: any = new Date(subscription.plans[0].startDate);
            const serviceEndDate: any = new Date(subscription.plans[0].endDate);
            const todayDate: any = new Date();

            const numDaysRadioActive: number = Math.floor((todayDate - serviceStartDate) / (1000 * 60 * 60 * 24));
            const numDaysRadioInactive: number = Math.floor((todayDate - serviceEndDate) / (1000 * 60 * 60 * 24));

            this._dataLayerSrv.update(DataLayerDataTypeEnum.PlanInfo, {
                serviceStartDate: serviceStartDate,
                serviceEndDate: serviceEndDate,
                ...(numDaysRadioActive >= 0 && { numDaysRadioActive }),
                ...(numDaysRadioInactive >= 0 && { numDaysRadioInactive }),
            });
        }
    }

    private _buildDataLayerDeviceInfo(): void {
        const deviceInfoObj: any = this._dataLayerSrv.getData(DataLayerDataTypeEnum.DeviceInfo) || {};

        if (this._comingAccount) {
            const hasSubscriptions = this._comingAccount.subscriptions && this._comingAccount.subscriptions.length > 0;
            const offerPackage: PackageModel = this._comingOffer.offers[0];
            const closedDevices: Array<any> = this._comingAccount.closedDevices;
            if (hasSubscriptions) {
                const subscription: SubscriptionModel = this._comingAccount.subscriptions[0];
                if (subscription.radioService) {
                    deviceInfoObj.esn = subscription.radioService.last4DigitsOfRadioId;
                    deviceInfoObj.status = RadioStatusEnum.Active;
                    deviceInfoObj.serviceId = subscription.radioService.id;
                }
            } else if (closedDevices && closedDevices.length > 0) {
                deviceInfoObj.esn = closedDevices[0].last4DigitsOfRadioId;
                deviceInfoObj.status = RadioStatusEnum.Closed;
                deviceInfoObj.serviceId = null;
            }
            deviceInfoObj.promoCode = offerPackage.promoCode;
        }

        this._dataLayerSrv.update(DataLayerDataTypeEnum.DeviceInfo, deviceInfoObj);
    }

    private _buildDataLayerCustomerInfo(pvtTime: string): void {
        const customerInfoObj: CustomerInfoData = this._dataLayerSrv.getData(DataLayerDataTypeEnum.CustomerInfo) || {};
        const accountObj: any = this._comingAccount;

        if (accountObj && accountObj.isNewAccount) {
            customerInfoObj.customerType = CustomerTypeEnum.NewAccount;
        } else if (this._isFlepz && accountObj) {
            customerInfoObj.firstName = accountObj.firstName;
            customerInfoObj.email = accountObj.email;

            if (this._isFlepz) {
                if (!customerInfoObj || !customerInfoObj.authenticationType) {
                    customerInfoObj.authenticationType = AuthenticationTypeEnum.Flepz;
                }
            }

            customerInfoObj.customerType = inTrialPostTrialSelfPayCustomerType(accountObj, pvtTime, this._isStudent);
        }

        this._dataLayerSrv.update(DataLayerDataTypeEnum.CustomerInfo, customerInfoObj);
    }
}
