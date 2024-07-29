import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    activeSubscriptionCloseRerouteToFlepz,
    activeSubscriptionCloseRerouteToProactiveRtc,
    buildDataLayerCustomerInfo,
    buildDataLayerPlanInfoProducts,
    UpdateCheckoutAccount,
    LoadCheckoutFlepzAccount,
} from '@de-care/checkout-state';
import { DataLayerService, PurchasePlanRevenueStatus } from '@de-care/data-layer';
import {
    ChildQuoteFeeModel,
    ChildQuoteModel,
    CustomerInfoData,
    DataLayerDataTypeEnum,
    PlanTypeEnum,
    QuoteFeesLabelEnum,
    TransactionTypeEnum,
    DataAccountService,
    DataOfferService,
} from '@de-care/data-services';
import { Actions, createEffect, ofType, act } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { tap, withLatestFrom, map, concatMap, catchError } from 'rxjs/operators';
import {
    getIsTokenizedLink,
    getOfferOrUpsell,
    getProgramCode,
    getProgramAndRenewalCode,
    getUpsellCode,
    getFirstSubscriptionIdInCheckoutAccount,
    getOfferState,
    getCheckoutAccount,
    getPromoExtraParameters,
    getIsPickAPlan,
    getSelectedOfferPlancode,
} from './checkout-triage.selectors';
import {
    getFirstSubscriptionInPurchaseAccount,
    getIsAddSubscription,
    getPurchaseDataAccount,
    getFirstOfferPlanCode,
    getPurchaseProgramCode,
} from './purchase-triage.selectors';
import { loadAccountAndChangeStep, loadAccountFromCustomer } from './checkout-triage.actions';
import { ChangeStep, LoadFlepzDataSuccess, GetUpsells, LoadQuote } from '@de-care/purchase-state';
import { EMPTY } from 'rxjs';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { CheckIfNuCaptchaIsRequiredForCheckoutWorkflowService } from '../workflows/check-if-nucaptcha-is-required-for-checkout.service';

@Injectable()
export class CheckoutTriageEffects {
    constructor(
        private _store: Store,
        private _actions$: Actions,
        private _router: Router,
        private readonly _settings: SettingsService,
        private _dataLayerSrv: DataLayerService,
        private _dataOfferService: DataOfferService,
        private _dataAccountService: DataAccountService,
        private _userSettingsService: UserSettingsService,
        private readonly _checkIfNuCaptchaIsRequiredForCheckoutWorkflowService: CheckIfNuCaptchaIsRequiredForCheckoutWorkflowService
    ) {}
    activeSubscriptionCloseRerouteToFlepz$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(activeSubscriptionCloseRerouteToFlepz),
                withLatestFrom(this._store.pipe(select(getProgramCode))),
                tap(([_, programCode]) => {
                    // Note: replaceUrl option is needed here because there are several factors in the app architecture
                    //       that make it so a "back" navigation will not result in a reload of the state data. So we
                    //       replace the url here so that the user will not have the previous url in their browser state history
                    //       to avoid the issue.
                    this._router.navigate(['/subscribe/checkout/flepz'], { queryParams: { programcode: programCode }, replaceUrl: true });
                })
            ),
        { dispatch: false }
    );

    activeSubscriptionCloseRerouteToProactiverRtc$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(activeSubscriptionCloseRerouteToProactiveRtc),
                withLatestFrom(this._store.pipe(select(getProgramAndRenewalCode))),
                tap(([_, queryParams]) => {
                    this._router.navigate(['/subscribe/checkout/renewal/flepz'], { queryParams, replaceUrl: true });
                })
            ),
        { dispatch: false }
    );

    buildDataLayerCustomerInfo$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(buildDataLayerCustomerInfo),
                withLatestFrom(
                    this._store.pipe(select(getIsTokenizedLink)),
                    this._store.pipe(select(getPurchaseDataAccount)),
                    this._store.pipe(select(getFirstSubscriptionInPurchaseAccount)),
                    this._store.pipe(select(getIsAddSubscription))
                ),
                tap(([{ isFlepz }, isTokenizedLink, account, firstSubscriptionInAccount, isAddSubscription]) => {
                    const dataAttribute = DataLayerDataTypeEnum.CustomerInfo;
                    if ((isTokenizedLink || isFlepz) && account !== null) {
                        const customerInfoObj: CustomerInfoData = this._dataLayerSrv.getData(dataAttribute) || {};

                        if (
                            firstSubscriptionInAccount &&
                            firstSubscriptionInAccount.plans[0] &&
                            firstSubscriptionInAccount.plans[0].type === PlanTypeEnum.Trial &&
                            (!firstSubscriptionInAccount.followonPlans || firstSubscriptionInAccount.followonPlans.length === 0)
                        ) {
                            customerInfoObj.transactionType = TransactionTypeEnum.Conversion;
                            this._dataLayerSrv.update(dataAttribute, customerInfoObj);
                        } else if (isAddSubscription) {
                            customerInfoObj.transactionType = TransactionTypeEnum.Activation;
                            this._dataLayerSrv.update(dataAttribute, customerInfoObj);
                        }
                    }
                })
            ),
        { dispatch: false }
    );

    buildDataLayerPlanInfoProducts$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(buildDataLayerPlanInfoProducts),
                withLatestFrom(
                    this._store.pipe(select(getIsTokenizedLink)),
                    this._store.pipe(select(getOfferOrUpsell)),
                    this._store.pipe(select(getPurchaseDataAccount)),
                    this._store.pipe(select(getIsPickAPlan))
                ),
                tap(([{ isFlepz }, isTokenizedLink, offerOrUpsell, account, isPickAPlan]) => {
                    const planInfoObj: any = this._dataLayerSrv.getData(DataLayerDataTypeEnum.PlanInfo) || {};
                    let isUpdated: boolean = false;
                    if (isTokenizedLink || isFlepz || isPickAPlan) {
                        planInfoObj['products'] = planInfoObj['products'] || {};
                        const planProductsData = planInfoObj['products'];
                        if (offerOrUpsell) {
                            // Plan Purchased (CMN-ANA-PLA-040, CMN-ANA-PLA-050, CMN-ANA-PLA-100)
                            planProductsData.purchasePlan = {
                                planCode: offerOrUpsell.planCode,
                                price: offerOrUpsell.price,
                                marketType: offerOrUpsell.marketType,
                                termLength: offerOrUpsell.termLength,
                            };

                            // Tax & Fees (CMN-ANA-PLA-060, CMN-ANA-PLA-070, CMN-ANA-PLA-072)
                            if (offerOrUpsell.quote) {
                                let quoteObj: ChildQuoteModel = offerOrUpsell.quote.currentQuote;

                                if (quoteObj) {
                                    planProductsData.purchasePlan.revenueStatus = PurchasePlanRevenueStatus.Immediate;
                                } else {
                                    planProductsData.purchasePlan.revenueStatus = PurchasePlanRevenueStatus.Deferred;
                                    quoteObj = offerOrUpsell.quote.futureQuote;
                                }
                                if (quoteObj) {
                                    planProductsData.purchasePlan.tax = Number(quoteObj.totalTaxAmount);
                                    const activationFee: Number = this._extractQuoteFee(quoteObj.fees, QuoteFeesLabelEnum.Activation_Fee);
                                    if (activationFee) {
                                        planProductsData.activationFee = activationFee;
                                    }
                                    const royaltyFee: Number = this._extractQuoteFee(quoteObj.fees, QuoteFeesLabelEnum.US_Music_Royalty_Fee);
                                    planProductsData.purchasePlan.royaltyFee = royaltyFee;
                                }

                                if (offerOrUpsell.quote.renewalQuote) {
                                    const planObj = offerOrUpsell.quote.renewalQuote.details.filter((plan) => plan.planCode)[0];
                                    // Plan Purchased (CMN-ANA-PLA-041)
                                    planInfoObj['products'].renewalPlan = { planCode: planObj.planCode };

                                    // Tax & Fees (CMN-ANA-PLA-051, CMN-ANA-PLA-061, CMN-ANA-PLA-071)
                                    const renewalQuote: ChildQuoteModel = offerOrUpsell.quote.renewalQuote;

                                    planProductsData.renewalPlan.price = Number(renewalQuote.pricePerMonth);
                                    planProductsData.renewalPlan.tax = Number(renewalQuote.totalTaxAmount);
                                    const activationFee: Number = this._extractQuoteFee(renewalQuote.fees, QuoteFeesLabelEnum.Activation_Fee);
                                    if (activationFee) {
                                        planProductsData.renewalPlan.activationFee = activationFee;
                                    }
                                    const royaltyFee: Number = this._extractQuoteFee(renewalQuote.fees, QuoteFeesLabelEnum.US_Music_Royalty_Fee);
                                    planProductsData.renewalPlan.royaltyFee = royaltyFee;
                                }
                            }
                            isUpdated = true;
                        }
                        if (!planInfoObj.subscriptionId && account && account.subscriptionId) {
                            planInfoObj.subscriptionId = account.subscriptionId;
                            isUpdated = true;
                        }
                    }
                    if (isUpdated) {
                        this._dataLayerSrv.update(DataLayerDataTypeEnum.PlanInfo, planInfoObj);
                    }
                })
            ),
        { dispatch: false }
    );

    loadAccountFromCustomer$ = createEffect(() =>
        this._actions$.pipe(
            ofType(loadAccountFromCustomer),
            withLatestFrom(this._userSettingsService.selectedCanadianProvince$, this._store.pipe(select(getPromoExtraParameters))),
            concatMap(([action, selectedProvince, { promoCode }]) => {
                const canadaProvince = this._settings.isCanadaMode ? selectedProvince : null;
                return this._dataOfferService
                    .customer({
                        streaming: action.isStreaming,
                        ...(action.programCode && { programCode: action.programCode }),
                        ...(canadaProvince && { province: canadaProvince }),
                        ...(promoCode && { marketingPromoCode: promoCode }),
                    })
                    .pipe(
                        map((offer) =>
                            loadAccountAndChangeStep({
                                offer: offer,
                                isStreaming: action.isStreaming,
                                formStep: action.formStep,
                                attemptedEmail: action.attemptedEmail,
                            })
                        )
                    );
            }),
            catchError(() => EMPTY)
        )
    );

    loadAccountAndChangeStep$ = createEffect(() =>
        this._actions$.pipe(
            ofType(loadAccountAndChangeStep),
            withLatestFrom(
                this._store.pipe(select(getFirstOfferPlanCode)),
                this._store.pipe(select(getPurchaseProgramCode)),
                this._store.pipe(select(getUpsellCode)),
                this._store.pipe(select(getFirstSubscriptionIdInCheckoutAccount))
            ),
            concatMap(([action, planCode, programCode, upsellCode, subscriptionIdFromState]) => {
                const subscriptionId = action.isStreaming ? subscriptionIdFromState : undefined;
                const customerAccount = this._dataAccountService.generateEmptyAccount();
                customerAccount.customerInfo.email = action.attemptedEmail;
                return [
                    LoadCheckoutFlepzAccount({ payload: { account: customerAccount, offer: action.offer } }),
                    LoadFlepzDataSuccess({ payload: { account: customerAccount, programCode, offer: action.offer } }),
                    ...(action.formStep ? [ChangeStep({ payload: action.formStep })] : []),
                    ...(upsellCode
                        ? [
                              GetUpsells({
                                  payload: {
                                      planCode,
                                      upsellCode,
                                      streaming: action.isStreaming,
                                      ...(subscriptionId ? { subscriptionId } : {}),
                                  },
                              }),
                          ]
                        : []),
                ];
            })
        )
    );

    onLoadQuote$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(LoadQuote),
                withLatestFrom(this._store.pipe(select(getSelectedOfferPlancode))),
                concatMap(([, selectedPlanCode]) => {
                    return this._checkIfNuCaptchaIsRequiredForCheckoutWorkflowService.build(selectedPlanCode);
                })
            ),
        { dispatch: false }
    );

    private _extractQuoteFee(fees: Array<ChildQuoteFeeModel>, feeLabel: QuoteFeesLabelEnum): Number {
        let feeAmount: Number = null;
        if (fees && feeLabel) {
            const feeObj: ChildQuoteFeeModel = fees.find((feeLineItem: ChildQuoteFeeModel) => {
                return feeLineItem.description === feeLabel;
            });
            if (feeObj) {
                feeAmount = Number(feeObj.amount);
            }
        }

        return feeAmount;
    }
}
