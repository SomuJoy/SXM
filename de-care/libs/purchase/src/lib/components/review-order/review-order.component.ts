import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { getIsOrderSummaryDetailsExpanded, getIsStudentFlow } from '@de-care/checkout-state';
import { DataLayerService, FrontEndErrorEnum, FrontEndErrorModel, SharedEventTrackService } from '@de-care/data-layer';
import {
    CheckoutTokenResolverErrors,
    ErrorTypeEnum,
    OfferDetailsModel,
    PackageModel,
    PurchaseCreateAccountDataModel,
    PurchaseCSAddressModel,
    PurchaseSPaymentInfo,
    PurchaseSubscriptionDataModel,
} from '@de-care/data-services';
import { CheckIfNuCaptchaAnswerIsValidForCheckoutWorkflowService } from '@de-care/de-care-use-cases/checkout/state-checkout-triage';
import {
    AddSubscription,
    ChangeSubscription,
    CreateAccount,
    getMarketingPromoCode,
    getPriceChangeViewModel,
    PaymentInfoAddress,
    PrepaidRedeem,
} from '@de-care/purchase-state';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { getFeatureFlagEnableQuoteSummary } from '@de-care/shared/state-feature-flags';
import { SxmUiNucaptchaComponent } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { Action, select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ReviewModel } from '../../models/savedCCModel.model';

@Component({
    selector: 'app-review-order',
    templateUrl: './review-order.component.html',
    styleUrls: ['./review-order.component.scss'],
})
export class ReviewOrderComponent implements OnInit, OnChanges, OnDestroy {
    @Input() reviewObject: ReviewModel;
    @Input() details: OfferDetailsModel;
    @Input() isStreaming: boolean;
    @Input() selectedRenewalPlanCode: string;
    @Input() isMCP: boolean;
    @Input() followOnOfferPlanCode: string;
    @Input() displayNuCaptcha = false;
    @Input() isFlepz: boolean = false;

    @Input() set displayed(value: boolean) {
        // Reset the loading state whenever this component is considered "displayed"
        if (value) {
            this.loading$.next(false);
        }
    }

    isQuebec$ = this._userSettingsService.isQuebec$;
    enableQuoteSummaryFeatureToggle$ = this._store.pipe(select(getFeatureFlagEnableQuoteSummary));
    loading$ = new BehaviorSubject<boolean>(false);
    package: PackageModel;
    private _radioid: string;
    giftCardUsed: boolean = false;
    private _paymentInfo: any;
    private _giftCard: PrepaidRedeem;
    private _billingAddress: PaymentInfoAddress;
    private _serviceAddress: PaymentInfoAddress;
    private _marketingPromoCode: string;
    agreementAccepted: boolean = false;
    submitted: boolean = false;
    captchaAnswer: { answer: string };
    captchaAnswerWrong$ = new BehaviorSubject<boolean>(false);
    orderSummaryDetailsShouldBeExpanded$: Observable<boolean>;
    isStudentFlow$ = combineLatest([this._store.pipe(select(getIsStudentFlow)), this.isQuebec$]).pipe(map(([isStudent, isQuebec]) => isStudent && !isQuebec));
    priceChangeViewModel$ = this._store.select(getPriceChangeViewModel);
    @ViewChild('nuCaptcha', { static: false }) private _nucaptchaComponent: SxmUiNucaptchaComponent;
    private _unsubscribe: Subject<void> = new Subject();
    private _trackCompleteOrderAction: string = 'complete-order';
    private _trackComponentName: string = 'review-order';

    //================================================
    //===            Lifecycle events              ===
    //================================================
    constructor(
        private _store: Store<any>,
        private _eventTrackService: SharedEventTrackService,
        private _dataLayerSrv: DataLayerService,
        private _settingsService: SettingsService,
        private _userSettingsService: UserSettingsService,
        private _translateService: TranslateService,
        private _checkIfNuCaptchaAnswerIsValidForCheckoutWorkflowService: CheckIfNuCaptchaAnswerIsValidForCheckoutWorkflowService
    ) {}

    ngOnInit() {
            this._store.pipe(select(getMarketingPromoCode), takeUntil(this._unsubscribe)).subscribe((marketingPromoCode) => (this._marketingPromoCode = marketingPromoCode));
        this.orderSummaryDetailsShouldBeExpanded$ = this._store.pipe(select(getIsOrderSummaryDetailsExpanded));
    }

    ngOnChanges() {
        this.package = this.reviewObject.packages && this.reviewObject.packages[0];
        this._radioid = this.reviewObject.radioid;
        this._paymentInfo = this.reviewObject.paymentInfo;
        this._giftCard = this.reviewObject.giftCard;
        this.giftCardUsed = this._giftCard.balance ? true : false;
        this._billingAddress = this.reviewObject.billingAddress;
        this._serviceAddress = this.reviewObject.serviceAddress;
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    //================================================
    //===              Helper Methods              ===
    //================================================

    private _mapAddress(address: PaymentInfoAddress): PurchaseCSAddressModel {
        return {
            streetAddress: address.addressLine1,
            addressType: 'person',
            postalCode: address.zip,
            city: address.city,
            state: address.state,
            country: this._settingsService.settings.country.toUpperCase(),
            avsvalidated: address.avsvalidated,
        };
    }

    private _checkBilling = (quote) => {
        return {
            useCardOnfile: false,
            cardInfo: {
                nameOnCard: this._paymentInfo.ccName,
                cardNumber: this._paymentInfo.ccNum,
                expiryMonth: this._paymentInfo.ccMonth,
                securityCode: this._paymentInfo.ccCVV,
                expiryYear: this._paymentInfo.ccYear,
            },
            transactionId: this._paymentInfo.ccTransactionId,
            paymentType: 'creditCard',
            giftCards: [this._giftCard.giftCardNumber ? this._giftCard.giftCardNumber : null],
            paymentAmount:
                quote && quote.currentQuote && quote.currentQuote.currentBalance !== '' && Math.sign(quote.currentQuote.currentBalance + 0) === 1
                    ? quote.currentQuote.currentBalance
                    : null,
        };
    };

    completeOrder(): void {
        this.submitted = true;
        this.captchaAnswerWrong$.next(false);
        if (this.agreementAccepted && (!this.displayNuCaptcha || this.captchaAnswer?.answer)) {
            this.loading$.next(true);
            if (this.displayNuCaptcha) {
                const captchaToken = this._nucaptchaComponent.getCaptchaToken();
                this._checkIfNuCaptchaAnswerIsValidForCheckoutWorkflowService.build({ answer: this.captchaAnswer.answer, token: captchaToken }).subscribe((valid) => {
                    if (valid) {
                        this._completeOrderAction();
                    } else {
                        this.captchaAnswerWrong$.next(true);
                        this.loading$.next(false);
                    }
                });
            } else {
                this._completeOrderAction();
            }
        } else {
            this._dataLayerSrv.buildErrorInfo(new FrontEndErrorModel(ErrorTypeEnum.User, FrontEndErrorEnum.CheckoutMissingCCAgreement));
        }
    }

    gotCaptcha() {
        this.captchaAnswer = null;
    }

    private _completeOrderAction() {
        const radioId = this._radioid;
        const subscriptionId = this.reviewObject.subscriptionId;
        const dataTosend: PurchaseSubscriptionDataModel = {
            ...(radioId && { radioId }),
            ...(subscriptionId && { subscriptionId }),
            paymentInfo: null,
            marketingPromoCode: this._marketingPromoCode || undefined,
        };
        // NOTE we can grab this from the ngrx store
        let paymentInfo: PurchaseSPaymentInfo = {
            useCardOnfile: true,
            transactionId: this._paymentInfo ? this._paymentInfo.ccTransactionId : null,
        };
        if (this.reviewObject.email && !this.reviewObject.isNewAccount) {
            dataTosend.emailAddressChanged = true;
            dataTosend.serviceAddress = {
                email: this.reviewObject.email,
                avsvalidated: true,
            };
        }
        if (this._billingAddress.filled) {
            dataTosend.billingAddress = this._mapAddress(this._billingAddress);
        }

        if (!this._paymentInfo.ccSaved) {
            const quote = this.package ? this.package.quote : null;
            paymentInfo = this._checkBilling(quote);
        }

        dataTosend.paymentInfo = paymentInfo;

            const languagePreferenceOption = this._translateService.currentLang;
            dataTosend.languagePreference = languagePreferenceOption;

        let action: Action;
        const plans = [
            {
                planCode: this.package.planCode,
            },
        ];

        const followOnPlans = this.selectedRenewalPlanCode && [
            {
                planCode: this.selectedRenewalPlanCode,
            },
        ];

        if (
            this.reviewObject.isClosedRadio ||
            (this.reviewObject.isClosedStreaming && !this.reviewObject.isNewAccount) ||
            (this.reviewObject.streamingError && this.reviewObject.streamingError === CheckoutTokenResolverErrors.AddSubscriptionFlow)
        ) {
            if (followOnPlans) {
                dataTosend.followOnPlans = followOnPlans;
            }
            dataTosend.plans = plans;
            action = AddSubscription({ payload: dataTosend });
        } else if (this.reviewObject.isNewAccount) {
            //Todo: change this logic one ui supports it
            const flep = this.reviewObject.flep;

            dataTosend.billingAddress.firstName = flep.firstName;
            dataTosend.billingAddress.lastName = flep.lastName;
            dataTosend.billingAddress.email = flep.email;
            dataTosend.billingAddress.phone = flep.phoneNumber;

            dataTosend.serviceAddress = this._mapAddress(this._serviceAddress);
            dataTosend.serviceAddress.firstName = flep.firstName;
            dataTosend.serviceAddress.lastName = flep.lastName;
            dataTosend.serviceAddress.email = flep.email;
            dataTosend.serviceAddress.phone = flep.phoneNumber;

            dataTosend.plans = plans;

            if (this.isStreaming) {
                (dataTosend as PurchaseCreateAccountDataModel).streamingInfo = {
                    firstName: flep.firstName,
                    lastName: flep.lastName,
                    emailAddress: flep.email,
                    login: flep.email,
                    password: this.reviewObject.password,
                };
            }

            if (this.followOnOfferPlanCode) {
                dataTosend.followOnPlans = [{ planCode: this.followOnOfferPlanCode }];
            }

            action = CreateAccount({ payload: dataTosend });
        } else {
            if (this.reviewObject.isDataOnlyTrial) {
                dataTosend.plans = plans;
            } else {
                dataTosend.followOnPlans = plans;
            }
            if (followOnPlans) {
                dataTosend.followOnPlans = dataTosend.followOnPlans ? dataTosend.followOnPlans : [];
                dataTosend.followOnPlans = dataTosend.followOnPlans.concat(followOnPlans);
            }
            action = ChangeSubscription({ payload: dataTosend });
        }
        this._store.dispatch(action);

        this._eventTrackService.track(this._trackCompleteOrderAction, { componentName: this._trackComponentName });
    }
}
