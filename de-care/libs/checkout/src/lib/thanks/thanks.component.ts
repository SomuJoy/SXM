import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, Inject, OnDestroy, OnInit } from '@angular/core';
import { scrollToElementBySelector } from '@de-care/browser-common';
import { CheckoutState, CHECKOUT_CONSTANT, getIsStudentFlow, getIsOrderSummaryDetailsExpanded, RegisterAccount } from '@de-care/checkout-state';
import { DataLayerService, SharedEventTrackService } from '@de-care/data-layer';
import {
    AccountModel,
    ComponentNameEnum,
    DataLayerActionEnum,
    DataLayerDataTypeEnum,
    FlowNameEnum,
    getMaskedUserNameFromAccount,
    hasOnlyDataTrial,
    OfferDealModel,
    OfferModel,
    OfferPackage,
    PackageModel,
    PlanTypeEnum,
    RegisterDataModel,
    RegisterPasswordError,
    VehicleModel,
    DataUtilityService,
} from '@de-care/data-services';
import { getSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { HeroTitleTypeEnum } from '@de-care/domains/offers/ui-hero';
import { getSessionInfoId } from '@de-care/domains/utility/state-environment-info';
import {
    getIsRefreshAllowed,
    getIsTwoFactorAuthNeeded,
    getQuote,
    getSuccessfulTransactionSubscriptionId,
    PurchaseState,
    PurchaseStateConstant,
} from '@de-care/purchase-state';
import { PasswordError, RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import { AmazonLoginService } from '@de-care/domains/subscriptions/state-amazon-linking';
import { UserSettingsService } from '@de-care/settings';
import { PrintService } from '@de-care/shared/browser-common/window-print';
import { select, Store } from '@ngrx/store';
import { AmazonAuthResponse, ClaimDeviceStateType } from '@de-care/sales-common';
import { combineLatest, Observable, Subject, timer } from 'rxjs';
import { concatMap, map, take, takeUntil, tap } from 'rxjs/operators';
import { ThanksComponentService } from './thanks.component.service';
import { getFeatureFlagEnableQuoteSummary } from '@de-care/shared/state-feature-flags';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { behaviorEventImpressionForPage, behaviorEventReactionForEligibleForRegistration } from '@de-care/shared/state-behavior-events';

interface RegisterCompDataParams {
    email?: string;
    planCode?: string;
    isOfferStreamingEligible?: boolean;
    useEmailAsUsername?: boolean;
}

@Component({
    selector: 'app-thanks',
    templateUrl: './thanks.component.html',
    styleUrls: ['./thanks.component.scss'],
    providers: [ThanksComponentService],
})
export class ThanksComponent implements OnInit, OnDestroy, AfterViewInit {
    package: PackageModel;
    deal: OfferDealModel;
    offer: OfferModel;
    giftCardUsed: boolean = false;
    account: AccountModel;
    platform: string;
    vehicleInfo: VehicleModel;
    radioId: string;
    loading: boolean;
    securityQuestions$ = this._store.pipe(select(getSecurityQuestions));
    registrationCompleted: boolean;
    passwordError: any;
    registerCompData: RegisterCompDataParams;
    isOfferStreamingEligible: boolean;
    isTrial: boolean;
    enableQuoteSummaryFeatureToggle$ = this._store.pipe(select(getFeatureFlagEnableQuoteSummary));
    isClosedOrNoRadio: boolean;
    displayRefreshDevice: boolean;
    heroTitleType = HeroTitleTypeEnum.Thanks;
    isEligibleForRegistration: boolean;
    registerCredentialState: RegisterCredentialsState = RegisterCredentialsState.All;
    sessionId$ = this._store.pipe(select(getSessionInfoId));
    claimDeviceState: ClaimDeviceStateType = 'claim';
    leadOfferHastEtfAmmount: boolean;
    isStreaming: boolean;
    isStudentFlow$ = combineLatest([this._store.pipe(select(getIsStudentFlow)), this._userSettingsService.isQuebec$]).pipe(
        map(([isStudent, isQuebec]) => isStudent && !isQuebec)
    );
    quotes$ = this._store.select(getQuote);
    maskedUsername: string;

    orderSummaryDetailsShouldBeExpanded$: Observable<boolean>;
    offerType: PlanTypeEnum;
    isDataOnlyTrial: boolean;

    streamingPlayerLink: string;

    isTwoFactorAuthNeeded$ = this._store.select(getIsTwoFactorAuthNeeded);
    subscriptionId$ = this._store.select(getSuccessfulTransactionSubscriptionId);

    isMilitary: boolean = false;

    isRefreshAllowed$ = this._store.select(getIsRefreshAllowed);

    @HostBinding('attr.data-e2e')
    dataE2e = 'satelliteStreamingThanksPage';

    private flowName: FlowNameEnum = FlowNameEnum.Checkout;
    private componentName: ComponentNameEnum = ComponentNameEnum.Confirmation;
    private unsubscribe: Subject<void> = new Subject();
    private _window: Window;
    private readonly _amazonIdmError: string = 'amazon-idm-error';

    constructor(
        private _store: Store<any>,
        private _thanksComponentService: ThanksComponentService,
        private _dataLayerSrv: DataLayerService,
        private _printService: PrintService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _eventTrackService: SharedEventTrackService,
        private _amazonLoginService: AmazonLoginService,
        @Inject(DOCUMENT) document: Document,
        private _userSettingsService: UserSettingsService,
        private _dataUtilityService: DataUtilityService
    ) {
        this._window = document && document.defaultView;
    }

    ngOnInit() {
        this._store
            .select((state) => state[PurchaseStateConstant.STORE.NAME] as PurchaseState)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((state) => {
                if (!state.reviewOrder.agreement) {
                    this._thanksComponentService.handleNoStateData();
                    return;
                }
                this.giftCardUsed = !!state.prepaidCard;
                this.isOfferStreamingEligible = state.data.isOfferStreamingEligible;
                this.isEligibleForRegistration = state.data.isEligibleForRegistration;
                this.isEligibleForRegistration && this._store.dispatch(behaviorEventReactionForEligibleForRegistration());
            });

        this._store
            .select((state) => state[CHECKOUT_CONSTANT.STORE.NAME])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((state: CheckoutState) => {
                this.offer = state.selectedOffer || state.offer;
                if (!this.offer) {
                    this._thanksComponentService.handleNoStateData();
                    return;
                }
                this.package = this.offer.offers[0];
                this.leadOfferHastEtfAmmount = !(this.package?.deal?.etfAmount > 0);
                this.deal = this.package.deal;
                this.account = state.account;
                const offerPkg = new OfferPackage(this.package);
                this.platform = offerPkg.platform;
                this.offerType = this.offer && this.offer.offers.length > 0 ? this.offer.offers[0].type : PlanTypeEnum.Default;
                this.isDataOnlyTrial = hasOnlyDataTrial(this.account);
                const subscription = this.account.subscriptions[0];
                this.isStreaming = state.isStreaming;

                this.heroTitleType = this.isStreaming ? HeroTitleTypeEnum.ThanksStreaming : HeroTitleTypeEnum.Thanks;

                this.isMilitary = this.package.quote?.renewalQuote?.details[0]?.isMilitary;

                if (this.isStreaming) {
                    this.maskedUsername = getMaskedUserNameFromAccount(this.account) || state.maskedUserName;
                    this.streamingPlayerLink = 'checkout.thanksComponent.STREAMING_PLAYER_LINK.STREAMING_RTP_OFFER';
                } else {
                    this.streamingPlayerLink = 'checkout.thanksComponent.STREAMING_PLAYER_LINK.SATELLITE_OFFER';
                }
                // common radios
                if (subscription) {
                    this.radioId = subscription.radioService && subscription.radioService.last4DigitsOfRadioId;
                    this.vehicleInfo = subscription.radioService && subscription.radioService.vehicleInfo;
                    this.isTrial = subscription.plans[0]?.type === 'TRIAL';
                    //closed radios
                } else {
                    const closedDevices = state.account.closedDevices[0];
                    if (closedDevices) {
                        this.radioId = closedDevices && closedDevices.last4DigitsOfRadioId;
                        this.vehicleInfo = closedDevices.vehicleInfo;
                    }
                    this.isClosedOrNoRadio = true;
                }
                this.registrationCompleted = !!state.account.accountProfile.newRegister;
                this.passwordError = null;
                if (state.registrationError && state.registrationError instanceof RegisterPasswordError) {
                    if (state.registrationError.key === 'validation.password.new.dictionaryWords') {
                        this.passwordError = { reservedWords: state.registrationError.reservedWords } as PasswordError;
                    } else {
                        this.passwordError = { genericError: true } as PasswordError;
                    }
                }
                this.loading = state.loading;

                //const planCode: string = subscription.plans[0].code;
                this.registerCompData = {
                    email: state.account.email,
                    //planCode: planCode,
                    isOfferStreamingEligible: this.isOfferStreamingEligible,
                    useEmailAsUsername: state.account.useEmailAsUsername,
                };
                this.setupRegisterCredentialsState();
                this._changeDetectorRef.markForCheck();
            });

        this.orderSummaryDetailsShouldBeExpanded$ = this._store.pipe(select(getIsOrderSummaryDetailsExpanded));
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    ngAfterViewInit() {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'Confirmation' }));
        // delay is needed because at the time AfterViewInit fires, the previous route's elements are still in the DOM
        timer(500).subscribe(() => {
            if (this.deal) {
                scrollToElementBySelector('.deal');
            } else if (this.isStreaming) {
                scrollToElementBySelector('.stream-now');
            }
        });
    }

    onPrintClick(): void {
        this._printService.print();
    }

    onRegisterAccount($event: RegisterDataModel): void {
        // Dispatch will register the account and dispatch a action on success
        this._store.dispatch(RegisterAccount({ payload: $event }));
    }

    onSubmit(): void {
        this._dataLayerSrv.sendExplicitEventTrackEvent(DataLayerActionEnum.RegisterClicked, { componentName: ComponentNameEnum.TrialConfirmation });
    }

    onAmazonAuthResponse(response: AmazonAuthResponse) {
        if (response.authRequest.code) {
            this._store
                .pipe(
                    select(getSuccessfulTransactionSubscriptionId),
                    take(1),
                    concatMap((subscriptionId) =>
                        this._amazonLoginService.authenticate({
                            authCode: response.authRequest.code,
                            subscriptionId,
                            redirectUri: this._window.location.href.replace('subscribe/checkout/thanks', 'amzauth'),
                        })
                    )
                )
                .subscribe(
                    (result) => {
                        if (result.status) {
                            if (result.status === 'SUCCESS') {
                                this._eventTrackService.track('amazon-idm-success', { componentName: this.componentName });
                                this.claimDeviceState = 'success';
                            } else {
                                this._eventTrackService.track(this._amazonIdmError, { componentName: this.componentName });
                                this.claimDeviceState = 'error';
                            }
                        }
                        this._changeDetectorRef.markForCheck();
                    },
                    (error) => {
                        this._eventTrackService.track(this._amazonIdmError, { componentName: this.componentName });
                        this.claimDeviceState = 'error';
                        this._changeDetectorRef.markForCheck();
                    }
                );
        } else {
            this._eventTrackService.track(this._amazonIdmError, { componentName: this.componentName });
            this.claimDeviceState = 'error';
        }
    }

    private setupRegisterCredentialsState() {
        const hasExistingAccount = this.account.hasUserCredentials;
        const streamingEligible = this.registerCompData.isOfferStreamingEligible;
        const useEmailAsUser = this.registerCompData.useEmailAsUsername;

        if (streamingEligible) {
            if (hasExistingAccount) {
                this.registerCredentialState = RegisterCredentialsState.None;
            } else {
                this.registerCredentialState = useEmailAsUser ? RegisterCredentialsState.PasswordOnly : RegisterCredentialsState.All;
            }
            return;
        }

        this.registerCredentialState = useEmailAsUser ? RegisterCredentialsState.PasswordOnly : RegisterCredentialsState.All;
    }
}
