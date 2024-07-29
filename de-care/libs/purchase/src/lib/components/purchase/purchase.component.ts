import { DOCUMENT } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UrlHelperService } from '@de-care/app-common';
import { scrollToElement, scrollToElementBySelector } from '@de-care/browser-common';
import {
    ClearUpsell,
    getCheckoutAccount,
    getDefaultRenewalPackageName,
    getIsProactiveRtc,
    getIsRtc,
    getLeadOfferPackageName,
    getRenewalPackageOptions,
    getSelectedRenewalOfferPlanCodeAndPrice,
    getSelectedRenewalPackageName,
    LoadCheckoutFlepzAccount,
    SetSelectedOfferPackageName,
    SelectedUpsell,
    SetSelectedRenewalPlan,
    getCheckoutOffers,
    getPickAPlanSelectedOfferPackageName,
    getCheckoutState,
    CheckoutState,
} from '@de-care/checkout-state';
import { PaymentInfoOutput } from '@de-care/customer-info';
import { getCustomerName } from '@de-care/customer-state';
import { CoreLoggerService, DataLayerService, SharedEventTrackService } from '@de-care/data-layer';
import {
    AccountModel,
    AuthenticationTypeEnum,
    CheckoutTokenResolverErrors,
    ComponentNameEnum,
    CustomerInfoData,
    CustomEventNameEnum,
    DataLayerActionEnum,
    DataLayerDataTypeEnum,
    DataOfferService,
    FlowNameEnum,
    getActivePlansOnAccount,
    getMrdDiscount,
    getRadioIdFromAccount,
    getSubscriptionIdFromAccount,
    getVehicleOnAccount,
    hasOnlyDataTrial,
    isOfferMCP,
    OfferDetailsModel,
    OfferDetailsRTCModel,
    OfferModel,
    PackageModel,
    PlanTypeEnum,
    PurchaseStepEnum,
    QueryParamEnum,
} from '@de-care/data-services';
import {
    getOfferOrUpsellIsUpgradePromo,
    loadAccountFromCustomer,
    getSatelliteUpsellOffersVM,
    upsellPlanCodeSelected,
    upsellPlanCodeUnselected,
    setRenewalPackageNameAndLoadOffersInfo,
    getLegalCopyData,
    getChoiceGenrePackageNameOptions,
    getAddGenreStep,
    getPickAPlanOfferDetails,
    getIsPickAPlan,
    CheckIfStreamingPlanCodeIsEligibleWorkflowService,
    LoadCustomerFallbackOfferForFailedStreamingEligibilityWorkflowService,
    getFirstOfferIsEligible,
} from '@de-care/de-care-use-cases/checkout/state-checkout-triage';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { inTrialPostTrialSelfPayCustomerType } from '@de-care/domains/account/state-account';
import { selectFirstFollowOnOffer, selectFirstFollowOnOfferPlanCode } from '@de-care/domains/offers/state-follow-on-offers';
import { getPvtTime, getSessionInfoId } from '@de-care/domains/utility/state-environment-info';
import { Tabs } from '@de-care/identification';
import { FollowOnPlanSelectionData, FollowOnSelectionComponent, PlanComparisonGridParams, RetailPriceAndMrdEligibility } from '@de-care/offers';
import {
    AddCCTransactionId,
    CCError,
    ChangeStep,
    ClearForm,
    CollectForm,
    CreditCardSelect,
    getAccountData,
    getData,
    getFormStep,
    getPlatformChangedFlag,
    getPurchaseState,
    getSelectedOfferOrOffer,
    getServiceError,
    getUpgrade,
    getUpgrades,
    GetUpsells,
    LoadData,
    LoadFlepzDataSuccess,
    LoadQuoteFromUpdatedOffer,
    PrepaidRedeem,
    PurchaseStep,
    ResetTransactionId,
    reviewState,
    SetFlepzForm,
    SetStepNumberForErrorRedirects,
    updatePurchaseFormSteps,
    VerifyFlepzAccount,
    LoadSelectedOffer,
    LoadQuote,
    LoadSelectedChoicePlan,
} from '@de-care/purchase-state';
import { AdditionalCopyOptions } from '@de-care/sales-common';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, EMPTY, iif, Observable, of, Subject } from 'rxjs';
import { concatMap, delay, filter, map, mapTo, mergeMap, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import * as uuid from 'uuid/v4';
import { ReviewModel } from '../../models/savedCCModel.model';
import { AccountLookupStepComplete, StepCompleteReasonEnum } from '../../page-parts/account-lookup-step/account-lookup-step.component';
import { ReviewSubscriptionOptions } from '../review-subscription-options/review-subscription-options.component';
import { behaviorEventReactionRenewalPlanSelected, behaviorEventReactionPickAPlanSelected, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';

interface RtcData {
    renewalPlanSelectionData: FollowOnPlanSelectionData;
    renewalPackageNames: string[];
    reviewSubscriptionOptions: ReviewSubscriptionOptions;
    planComparisonGridParams: PlanComparisonGridParams;
    retailPrices: RetailPriceAndMrdEligibility[];
}

@Component({
    selector: 'checkout-purchase',
    templateUrl: './purchase.component.html',
    styleUrls: ['./purchase.component.scss'],
})
export class PurchaseComponent implements OnInit, OnDestroy {
    private _isFlepz: boolean = false;
    private _isTokenizedLink: boolean = false;

    //================================================
    //===                Decorators                ===
    //================================================

    @Input() deviceLookupPrefillData: { identifier: string; type: 'RadioId' | 'VIN' };

    @Input()
    set account(account: AccountModel) {
        this._account = account;
    }

    @Input()
    streamingError: CheckoutTokenResolverErrors;
    @Input()
    isMCP: boolean;
    @Input()
    isStreaming: boolean;

    get account() {
        if (this._isFlepz && !this._accountLookupStepData) {
            return this.flepzAccount;
        }
        return this._account;
    }

    @Input() offer: OfferModel;
    @Input() programCode: string;

    @Input()
    set isFlepz(value: boolean) {
        this._isFlepz = value;
    }

    @Input()
    set isTokenizedLink(value: boolean) {
        this._isTokenizedLink = value;
    }

    // TODO: remove this once feature flag enableCmsContent is removed
    @Input() useCmsContent = false;

    @Output() stepChange = new EventEmitter<PurchaseStepEnum>(true);

    @Input() isStudentFlow = false;
    @Input() reducedFields = false;

    @Input() displayOfferNucaptcha = false;

    get isFlepz() {
        return this._isFlepz;
    }

    get isTokenizedLink() {
        return this._isTokenizedLink;
    }

    //================================================
    //===                Variables                 ===
    //================================================
    protected _logPrefix: string = '[Purchase]:';

    flepzAccount: AccountModel;
    yourDeviceInfo: any;
    formStep: number;
    upgrades: any;
    private _upsellPlanCodeBeingConsidered$ = new BehaviorSubject<string>(null);
    legalCopyVM$ = combineLatest([
        this._store.pipe(select(getLegalCopyData)),
        this._upsellPlanCodeBeingConsidered$,
        this._store.pipe(
            select(getFormStep),
            map((formStep) => this.purchaseSteps[formStep - 1].id === PurchaseStepEnum.Upgrade)
        ),
    ]).pipe(
        map(([{ leadOfferPlanCode, selectedPlanCode, legalCopies }, upsellPlanCodeBeingConsidered, isUpsellStep]) => {
            if (isUpsellStep) {
                return legalCopies?.[upsellPlanCodeBeingConsidered ? upsellPlanCodeBeingConsidered : leadOfferPlanCode];
            } else {
                return legalCopies?.[selectedPlanCode];
            }
        })
    );
    upsellOffersVM$ = this._store.pipe(select(getSatelliteUpsellOffersVM));
    redeemPrepaidCard: PrepaidRedeem;
    purchaseSteps: PurchaseStep[] = [];
    offerDetailsCopyOptions: AdditionalCopyOptions = {
        showLegalCopy: false,
        showPriceChangeCopy: false,
    };

    @ViewChild('accountLookupStepTemplate', { static: true }) accountLookupStepTemplate: TemplateRef<any>;
    @ViewChild('accountLookupStepTemplateInactive', { static: true }) accountLookupStepTemplateInactive: TemplateRef<any>;
    @ViewChild('choiceGenreSelectionTemplate', { static: true }) choiceGenreSelectionTemplate: TemplateRef<any>;
    @ViewChild('choiceGenreSelectionInactiveTemplate', { static: true }) choiceGenreSelectionInactiveTemplate: TemplateRef<any>;
    @ViewChild('paymentInfoTemplate', { static: true }) paymentInfoTemplate: TemplateRef<any>;
    @ViewChild('upgradesTemplate', { static: true }) upgradesTemplate: TemplateRef<any>;
    @ViewChild('reviewTemplate', { static: true }) reviewTemplate: TemplateRef<any>;
    @ViewChild('flepzTemplate', { static: true }) flepzTemplate: TemplateRef<any>;
    @ViewChild('flepzTemplateInactive', { static: true }) flepzTemplateInactive: TemplateRef<any>;
    @ViewChild('reviewSubscriptionOptionsTemplate', { static: true }) reviewSubscriptionOptionsTemplate: TemplateRef<any>;

    @ViewChild('followOnSelectionModal') private followOnSelectionModal: SxmUiModalComponent;
    @ViewChild('followOnSelectionComp') private followOnSelectionComp: FollowOnSelectionComponent;

    @ViewChildren('stepElements') stepElements: QueryList<any>;

    ccError: boolean;
    loading: boolean;
    reviewObject: ReviewModel;
    transactionId: string;
    serviceError$: Observable<boolean>;
    isClosedRadio = true;
    offerDetails$: Observable<OfferDetailsModel>;
    isRTC$ = this._store.pipe(select(getIsRtc));
    isUpgradePromo$ = this._store.pipe(select(getOfferOrUpsellIsUpgradePromo));
    getAddGenreStep$ = this._store.pipe(select(getAddGenreStep));
    // NOTE: this will get updated to a selector that will getChoiceGenrePackageOptions once CMS integration is done.
    choiceGenrePackageOptions$ = combineLatest([this._store.select(getChoiceGenrePackageNameOptions), this._translateService.stream('app.packageDescriptions')]).pipe(
        map(([packageNames, packageDescriptions]) =>
            packageNames.map((packageName) => ({
                label: packageDescriptions[packageName]?.shortName,
                value: packageName,
                tooltipTitle: packageDescriptions[packageName]?.channels ? packageDescriptions[packageName].channels[0]?.title : null,
                tooltipText: packageDescriptions[packageName]?.channels ? packageDescriptions[packageName].channels[0]?.descriptions : null,
            }))
        )
    );

    rtcData$: Observable<RtcData>;
    RTCOfferDetails$: Observable<OfferDetailsRTCModel>;
    pickAPlanOfferDetails$ = this._store.pipe(select(getPickAPlanOfferDetails));
    currentOffer: OfferModel;
    isCanadaMode: boolean = false;
    leadOfferPackageName: string;
    userClickedSubscribe: boolean;
    selectedFollowOnIndex: number;
    trackEditAction: string = 'edit-section';
    trackComponentName: string = 'purchase';
    isNextStepReview: boolean = false;
    isOfferIncludesDevice: boolean = false;

    attemptedEmail: string;
    closeVerifyAccountModal$ = new Subject<boolean>();
    selectedRenewalPlanCode$: Observable<string>;

    platformIsChanged$ = this._store.pipe(select(getPlatformChangedFlag));
    customerName$ = this._store.pipe(select(getCustomerName));

    followOnOfferPlanCode$ = this._store.pipe(select(selectFirstFollowOnOfferPlanCode));

    verifyDeviceTabsToShowOverride: Tabs[] = null;

    customerIsEligibleForFirstOffer$ = this._store.select(getFirstOfferIsEligible);
    displayIneligibleLoader$ = new BehaviorSubject(false);

    private _unsubscribe: Subject<void> = new Subject();

    private _account: AccountModel;
    private _offer: OfferModel;
    private _accountLookupStepData: AccountLookupStepComplete;
    private _stepsHashArray: any;
    private _currentStepId: PurchaseStepEnum;
    private _currentFormStep: number;
    private _previousStepId: PurchaseStepEnum;

    selectedRenewalPackageName: string;
    selectedChoicePackageName: string;
    private _settedSelectedRenewalPackageName: string;
    private readonly _window: Window;
    //================================================
    //===            Lifecycle events              ===
    //================================================

    constructor(
        private _store: Store<any>,
        private _dataLayerSrv: DataLayerService,
        private _eventTrackService: SharedEventTrackService,
        private _route: ActivatedRoute,
        @Inject(DOCUMENT) document: Document,
        private _urlHelperService: UrlHelperService,
        private _settingsService: SettingsService,
        private _userSettingsService: UserSettingsService,
        private _translateService: TranslateService,
        private _changeDetectorRef: ChangeDetectorRef,
        private readonly _logger: CoreLoggerService,
        private _dataOfferService: DataOfferService,
        private readonly _checkIfStreamingPlanCodeIsEligibleWorkflowService: CheckIfStreamingPlanCodeIsEligibleWorkflowService,
        private readonly _loadCustomerFallbackOfferForFailedStreamingEligibilityWorkflowService: LoadCustomerFallbackOfferForFailedStreamingEligibilityWorkflowService
    ) {
        this.isCanadaMode = this._settingsService.isCanadaMode;
        this._window = document.defaultView;
        this._logger.debug(`${this._logPrefix} component started `);
    }

    ngOnInit() {
        if (this.deviceLookupPrefillData) {
            switch (this.deviceLookupPrefillData.type) {
                case 'RadioId': {
                    this.verifyDeviceTabsToShowOverride = ['radio-id-info', 'account-info'];
                    break;
                }
                case 'VIN': {
                    this.verifyDeviceTabsToShowOverride = ['vin-info', 'account-info'];
                    break;
                }
            }
        }

        this._dataLayerSrv.sendEventTrackEvent('DataLayer');
        this._store.pipe(select(getPvtTime), take(1)).subscribe((pvtTime) => this._buildDataLayerCustomerInfo(pvtTime));
        this._buildDataLayerCustomerInfo4SessionId();
        this._listenForAccountChange();
        this._listenForOfferChange();
        this._initializeSteps();
        this._setupFlepz();
        this._listenForChoicePackages();
        this._setupFormFromState();
        this._setupTransactionState();
        this._setupUpgradesFromState();
        this._setupReviewFromState();
        this._setupOfferDetailsFromState();
        this._setupLanguageChangeListener();
        this._handleRtcRenewalsOffers();

        this._handleSelectedPickAPlanCodeDataLayer();
        // watch for errors
        this.serviceError$ = this._store.pipe(select(getServiceError));
    }

    private _buildDataLayerCustomerInfo4SessionId(): void {
        this._store
            .pipe(
                select(getSessionInfoId),
                filter((id) => !!id),
                take(1)
            )
            .subscribe((id) => {
                const customerInfoObj: CustomerInfoData = this._dataLayerSrv.getData(DataLayerDataTypeEnum.CustomerInfo) || {};
                customerInfoObj.sessionId = id;
                this._dataLayerSrv.update(DataLayerDataTypeEnum.CustomerInfo, customerInfoObj);
            });
    }

    //================================================
    //===              Helper Methods              ===
    //================================================
    private _listenForAccountChange(): void {
        const account$ = this._store.pipe(takeUntil(this._unsubscribe), select(getAccountData));
        account$.subscribe((acct) => {
            this._account = acct || this.account;
        });
    }

    private _listenForOfferChange(): void {
        this._store
            .pipe(
                takeUntil(this._unsubscribe),
                select(getSelectedOfferOrOffer),
                filter((offer) => offer !== null && offer !== undefined),
                tap((offer) => {
                    const dealType = offer.offers[0]?.deal?.type;
                    if (dealType === 'AMZ_DOT' || dealType === 'GGLE_HUB' || dealType === 'GGLE_MINI') {
                        this.isOfferIncludesDevice = true;
                    } else {
                        this.isOfferIncludesDevice = false;
                    }
                    this.currentOffer = offer;
                    this._changeDetectorRef.markForCheck();
                })
            )
            .subscribe();
    }

    handleAccountLookupStepComplete(event: AccountLookupStepComplete) {
        this._accountLookupStepData = event;
        this.attemptedEmail = event.attemptedEmail;
        this._dataLayerSrv.setCustomerInfoToNewAccount(this.isStreaming);

        if (event.completeReason === StepCompleteReasonEnum.EmailAccountNotFound) {
            this._store.dispatch(
                loadAccountFromCustomer({ isStreaming: true, programCode: this.programCode, formStep: this.formStep + 1, attemptedEmail: event.attemptedEmail })
            );

            //Merge Note - loadAccountAndChangeStep code moved to checkout-triage.effects.ts
        }

        if (event.completeReason === StepCompleteReasonEnum.EmailAccountFoundAddSubscription) {
            const subscriptionId = event.selectedSubscription.id;
            this.closeVerifyAccountModal$.next(false);

            this._store
                .pipe(select(getCheckoutAccount), take(1))
                .pipe(
                    withLatestFrom(this._userSettingsService.selectedCanadianProvince$),
                    switchMap(([account, selectedProvince]) => {
                        let province;
                        if (this.isCanadaMode) {
                            province = account.serviceAddress ? account.serviceAddress.state : selectedProvince;
                            if (province !== selectedProvince) {
                                this._userSettingsService.setSelectedCanadianProvince(province);
                            }
                            this._userSettingsService.setProvinceSelectionDisabled(true);
                        }
                        this._account = account;
                        return this._dataOfferService.customer({
                            streaming: !!account.subscriptions[0].streamingService,
                            subscriptionId,
                            programCode: this.programCode,
                            province,
                        });
                    }),
                    switchMap((offer) => {
                        this._offer = offer;
                        return this._store.pipe(select(getData), take(1));
                    }),
                    withLatestFrom(this._userSettingsService.selectedCanadianProvince$)
                )
                .subscribe(([state, selectedProvince]) => {
                    const offer = this._offer.offers.length > 0 ? this._offer : state.offer;
                    this._store.dispatch(
                        LoadCheckoutFlepzAccount({
                            payload: {
                                account: this._account,
                                offer,
                            },
                        })
                    );
                    this._store.dispatch(
                        LoadFlepzDataSuccess({
                            payload: {
                                account: this._account,
                                programCode: this.programCode,
                                offer,
                            },
                        })
                    );
                    this._store.dispatch(
                        GetUpsells({
                            payload: {
                                planCode: offer.offers[0].planCode,
                                streaming: this.isStreaming,
                                ...(subscriptionId && { subscriptionId }),
                                province: this._settingsService.isCanadaMode ? selectedProvince : undefined,
                            },
                        })
                    );
                    this._store.dispatch(ChangeStep({ payload: this.formStep + 1 }));
                    this.closeVerifyAccountModal$.next(true);
                });
        }
    }

    private _initializeSteps() {
        this._addDefaultSteps();
        if (this._isFlepz && !this.isStudentFlow) {
            if (this.isStreaming) {
                this._addAccountLookupStep();
            } else {
                this._addFlepzStep();
            }
        }
        this._setStepNumberForErrorRedirects();
    }

    private _setStepNumberForErrorRedirects(): void {
        const paymentInfoStepIndex = this.purchaseSteps.findIndex((step) => step.id === PurchaseStepEnum.PaymentInfo);
        const stepNumberForErrorRedirects = paymentInfoStepIndex >= 0 ? paymentInfoStepIndex + 1 : 1;
        this._store.dispatch(SetStepNumberForErrorRedirects({ payload: stepNumberForErrorRedirects }));
    }

    private _setupFlepz(): void {
        if (this._isFlepz) {
            this._store.dispatch(
                LoadFlepzDataSuccess({
                    payload: {
                        offer: this.offer,
                        programCode: this.programCode ? this.programCode : null,
                        ...(this.isStudentFlow ? { account: this._account } : null),
                    },
                })
            );
        } else {
            this._store.dispatch(LoadData({ payload: { offer: this.offer, account: this._account, programCode: this.programCode } }));
        }
        this._store.dispatch(SetFlepzForm({ payload: this._isFlepz }));
        this._stepsHashArray = [];
    }

    private _setupFormFromState(): void {
        this._store.pipe(select(getFormStep), takeUntil(this._unsubscribe)).subscribe((formStep) => {
            this.formStep = formStep;
            const stepId = this.purchaseSteps[formStep - 1].id;
            this.stepChange.emit(stepId);
            this._updateOfferDetailsCopyOptions();
            const currentStepHash: number = this._stepsHashArray[formStep];
            if (!currentStepHash || currentStepHash !== 1) {
                this._updateDataLayer(formStep);
            }
            this._updateStepsHash(formStep);
            if (this._currentFormStep && this._currentFormStep < formStep) {
                // only scroll to step if the next step comes AFTER the previous step
                // ie not going backwards through the flow using edit
                this._scrollToStep(this._currentStepId);
            }
            this._previousStepId = this._currentStepId;
            this._currentStepId = stepId;
            this._currentFormStep = formStep;
        });
    }

    private _setupTransactionState(): void {
        this._store.pipe(select(getPurchaseState), takeUntil(this._unsubscribe)).subscribe((state) => {
            this.redeemPrepaidCard = state.cardValue;
            this.loading = state.data.isLoading;
            if ((this._isFlepz || this.isStreaming || this.isTokenizedLink) && !state.data.isLoading) {
                this._store.dispatch(pageDataFinishedLoading());
                this.flepzAccount = state.data.account;
                this.yourDeviceInfo = {
                    vehicleInfo: getVehicleOnAccount(state.data.account),
                    plans: getActivePlansOnAccount(state.data.account || this._account),
                    ...(state.data.account &&
                        state.data.account.closedDevices &&
                        state.data.account.closedDevices.length > 0 && { closedDate: state.data.account.closedDevices[0].closedDate }),
                };
            }
            this.ccError = state.ccErr;

            if (!this.transactionId) {
                this._generateNewCCTransaction();
            }
            if ((this.ccError || state.resetTransactionId) && this.transactionId) {
                this.transactionId = undefined;
                this._store.dispatch(ResetTransactionId({ payload: false }));
            }
        });
    }

    private _setupUpgradesFromState(): void {
        this._store.pipe(select(getUpgrades), takeUntil(this._unsubscribe)).subscribe((upgrades) => {
            this.upgrades = upgrades;
            // adding purchaseStep dynamically
            const currentStep = this._getCurrentStep();
            if (currentStep.id !== PurchaseStepEnum.Upgrade) {
                const upgrade = this.upgrades.upgradeOffers.upgrade;
                if ((!upgrades.platformChangedFlag || upgrades.platformChangeUpsellDeferred) && upgrade && upgrade.length > 0) {
                    this._addUpgradeStep();
                } else {
                    this._removePurchaseStep(PurchaseStepEnum.Upgrade);
                }
            }
            this._changeDetectorRef.markForCheck();
        });
        this._store
            .pipe(select(getLeadOfferPackageName), takeUntil(this._unsubscribe))
            .subscribe((leadOfferPackageName) => (this.leadOfferPackageName = leadOfferPackageName || ''));
    }

    private _setupReviewFromState(): void {
        this._store.pipe(select(reviewState), takeUntil(this._unsubscribe)).subscribe((state) => {
            this.isClosedRadio = state.isClosedRadio;
            const packages = state.offers ? state.offers.offers : state.currentOffers;
            this.reviewObject = {
                packages,
                isTrial: state.isTrial,
                radioid: state.radioId,
                paymentInfo: state.creditcard,
                isClosedRadio: state.isClosedRadio,
                giftCard: state.prepaid,
                giftCardUsed: !!state.prepaid,
                billingAddress: state.billingAddress,
                serviceAddress: state.serviceAddress,
                streamingError: this.streamingError,
                email: state.email,
                flep: state.flep,
                // in case isNewAccount property comes as undefined
                isNewAccount: this._account ? !!this._account.isNewAccount : false,
                password: state.password,
                subscriptionId: getSubscriptionIdFromAccount(this._account),
                isClosedStreaming: state.isClosedStreaming,
                isDataOnlyTrial: hasOnlyDataTrial(this._account),
            };
        });
    }

    private _setupOfferDetailsFromState(): void {
        this.offerDetails$ = combineLatest([this._store.pipe(select(getSelectedOfferOrOffer)), this._store.pipe(select(selectFirstFollowOnOffer))]).pipe(
            filter((offer) => offer !== null && offer !== undefined),
            map(([currentOffer, followOnOffer]) => {
                const offer = currentOffer && currentOffer.offers ? currentOffer.offers[0] : null;
                if (offer) {
                    this.currentOffer = currentOffer;
                    let offerType = PlanTypeEnum.Default;
                    if (offer.advantage && offer.type === PlanTypeEnum.PromoMCP) {
                        offerType = PlanTypeEnum.Advantage;
                    } else if (
                        this.isStreaming ||
                        offer.type === PlanTypeEnum.Promo ||
                        offer.type === PlanTypeEnum.TrialExtension ||
                        offer.type === PlanTypeEnum.PromoMCP ||
                        (this.isStudentFlow && offer.type === PlanTypeEnum.RtpOffer)
                    ) {
                        offerType = offer.type;
                    } else if (offer.type === PlanTypeEnum.RtpOffer || offer.type === PlanTypeEnum.Trial || offer.type === PlanTypeEnum.TrialRtp) {
                        offerType = PlanTypeEnum.Promo;
                    }

                    // TODO: change type to equal offerType only (remove deal.type)
                    const offerDetails: OfferDetailsModel = {
                        type: offer.deal ? offer.deal.type : offerType,
                        offerTotal: offer.price,
                        processingFee: offer.processingFee,
                        msrpPrice: offer.msrpPrice,
                        name: offer.packageName,
                        offerTerm: offer.termLength,
                        offerMonthlyRate: offer.pricePerMonth,
                        savingsPercent: Math.floor(((offer.retailPrice - offer.pricePerMonth) / offer.retailPrice) * 100),
                        retailRate: offer.retailPrice,
                        etf: offer.deal && offer.deal.etfAmount,
                        etfTerm: offer.deal && offer.deal.etfTerm,
                        priceChangeMessagingType: offer.priceChangeMessagingType,
                        isStreaming: this.isStreaming,
                        deal: offer.deal,
                        isMCP: isOfferMCP(offer.type),
                        isLongTerm: offer.type === 'LONG_TERM' ? true : false,
                        offerType: offer.type,
                        followOnTermLength: followOnOffer ? followOnOffer.termLength : null,
                        followOnPrice: followOnOffer ? followOnOffer.price : null,
                        packageUpgrade: offer.packageUpgrade,
                        packageUpgradePrice: offer.packageUpgradePrice,
                        marketType: offer.marketType,
                        isStudentOffer: offer.student,
                        isAdvantage: offer.advantage,
                    };

                    return offerDetails;
                }
                return null;
            })
        );
    }

    private _setupLanguageChangeListener(): void {
        this._translateService.onLangChange.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this._updatePurchaseStepTitles();
        });

        this.serviceError$ = this._store.pipe(select(getServiceError));
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
        this._logger.debug(`${this._logPrefix} component destroyed `);
    }

    handleEditClick(step: number) {
        this._logger.debug(`${this._logPrefix} Edit Step no ${step} `);
        this._stepsHashArray = [];
        this._store.dispatch(ChangeStep({ payload: step }));

        const nextStep = this.purchaseSteps[step - 1];
        const nextStepId: PurchaseStepEnum = nextStep.id;

        if (nextStepId === PurchaseStepEnum.Flepz && this._settingsService.isCanadaMode) {
            this._userSettingsService.setProvinceSelectionDisabled(false);
        }

        if (nextStepId === PurchaseStepEnum.Flepz) {
            this._userSettingsService.setProvinceSelectionDisabled(false);
        }

        // Track clicks on "Edit" in Accordion
        const currentAndPreviousStep = {
            currentStepId: this._currentStepId,
            previousStepId: this._previousStepId,
        };
        this._eventTrackService.track(DataLayerActionEnum.AccordionEdit, {
            componentName: ComponentNameEnum.Purchase,
            ...currentAndPreviousStep,
        });
    }

    handleSubscribeLinkClicked($event: boolean) {
        this.userClickedSubscribe = $event;
    }

    onOptionsModalRequested(): void {
        this._eventTrackService.track(DataLayerActionEnum.ViewOtherSubscriptionOptions, { componentName: ComponentNameEnum.SubscriptionOptionsStep });
        this._dataLayerSrv.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, ComponentNameEnum.ChoosePackageModal, {
            flowName: FlowNameEnum.Checkout,
            componentName: ComponentNameEnum.ChoosePackageModal,
        });
        this.followOnSelectionModal.open();
    }

    private _buildProvinceChangeCheck(province: string, account, isStreaming): Observable<boolean> {
        const tailObs$ = combineLatest([this._store.pipe(select(getUpgrade)), this._store.pipe(select(getData))]).pipe(
            filter(([packageUpgradesState, dataState]) => !packageUpgradesState.loading && !dataState.isLoading),
            take(1),
            mapTo(true)
        );

        if (province) {
            return this._userSettingsService.selectedCanadianProvince$.pipe(
                take(1),
                tap((currentProvince) => {
                    if (currentProvince !== province) {
                        this._userSettingsService.setSelectedCanadianProvince(province);
                        this._store.dispatch(
                            VerifyFlepzAccount({
                                payload: {
                                    account: account,
                                    loadUpsells: true,
                                    retrieveFallbackOffer: true,
                                    state: province,
                                    isStreaming: isStreaming,
                                },
                            })
                        );
                    }
                }),
                switchMap(() => tailObs$)
            );
        } else {
            return tailObs$;
        }
    }

    onPaymentFormCompleted(payload: PaymentInfoOutput) {
        const serviceAddress = payload.paymentForm.serviceAddress;
        // grab the province if we need it
        let province: string;
        if (this._settingsService.isCanadaMode && this.account.isNewAccount && serviceAddress) {
            province = serviceAddress.state;
            // we always want to disable the province selection UI after we have finished the payment method step
            this._userSettingsService.setProvinceSelectionDisabled(true);
        }

        if (this.isStreaming) {
            // NOTE: this upsells check should probably be done regardless of if isStreaming or not, but for right
            //       now (the hotfix for DEX-36376) we need to try and isolate the impact of these changes
            //       to streaming only since we have limited testing resources/time before the hotfix release.
            // if there are upsells then we can just proceed to the next step
            if (Array.isArray(this.upgrades?.upgradeOffers?.upgrade) && this.upgrades?.upgradeOffers?.upgrade.length > 0) {
                // If we have a province then we need to do the province change check, and whether we have
                //  a province or not we need to dispatch ChangeStep,
                //  so here we create an observable of either the province check or a stream that returns true
                //  to allow us to subscribe to either scenario and do the single final logic of
                //  dispatching the action.
                (province ? this._buildProvinceChangeCheck(province, this.account, true) : of(true)).subscribe(() => {
                    this._store.dispatch(ChangeStep({ payload: this.formStep + 1 }));
                });
                return;
            }
            // do eligibility check first
            this._listenForDisplayIneligibleLoader();
            this._checkIfStreamingPlanCodeIsEligibleWorkflowService
                .build()
                .pipe(
                    tap((eligibleForOffer) => this.displayIneligibleLoader$.next(!eligibleForOffer)),
                    concatMap((eligible) => {
                        if (eligible) {
                            //  if pass, check to see if we need to do province change load offer
                            return province ? this._buildProvinceChangeCheck(province, this.account, true) : of(true);
                        } else {
                            //  if failed, load offer
                            return this._loadCustomerFallbackOfferForFailedStreamingEligibilityWorkflowService.build(province);
                        }
                    })
                )
                .subscribe(() => this._loadQuoteFrmUpdatedOffer());
        } else {
            this._buildProvinceChangeCheck(province, this.account, false).subscribe(() => this._loadQuoteFrmUpdatedOffer());
        }
    }

    onSelectedFollowOn(planName: string): void {
        this.selectedRenewalPackageName = planName;
        this.selectedChoicePackageName = planName;
        this._store.dispatch(SetSelectedRenewalPlan({ payload: { packageName: this.selectedRenewalPackageName } }));
        this._handleSelectedRewalPlanCodeDataLayer();
    }

    handleSelectedFollowOnIndex($event) {
        this.selectedFollowOnIndex = $event;
    }

    followOnSelectionModalClosed() {
        this._store.dispatch(SetSelectedRenewalPlan({ payload: { packageName: this._settedSelectedRenewalPackageName } }));
        this._scrollToActiveStep();
    }

    onFollowOnContinue(): void {
        this._eventTrackService.track(DataLayerActionEnum.RtcContinue, { componentName: ComponentNameEnum.ChoosePackageModal });
        this._store.dispatch(setRenewalPackageNameAndLoadOffersInfo({ payload: { packageName: this.selectedRenewalPackageName ?? this._settedSelectedRenewalPackageName } }));
        this._settedSelectedRenewalPackageName = this.selectedRenewalPackageName;
        this.followOnSelectionModal.close();
        this._scrollToActiveStep();
    }

    onClearForms() {
        this._store.dispatch(ClearForm());
    }

    onUseCardOnFileSelected(useCardOnFile: boolean) {
        this._store.dispatch(CreditCardSelect({ payload: useCardOnFile }));
    }

    onPaymentFormSubmitted(paymentFormData) {
        this._store.dispatch(CollectForm({ payload: paymentFormData }));
    }

    onCCIsValid() {
        this._store.dispatch(CCError({ payload: false }));
    }

    onLoadingWithAlertMessageComplete($event: boolean) {
        if ($event) {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Animation:notEligibleToPurchasePlan' }));
        }
    }

    private _handleSelectedRewalPlanCodeDataLayer(): void {
        this._store
            .pipe(
                select(getSelectedRenewalOfferPlanCodeAndPrice),
                map(({ planCode, price }) => {
                    this._store.dispatch(behaviorEventReactionRenewalPlanSelected({ selected: { planCode, price } }));
                }),
                take(1)
            )
            .subscribe();
    }

    private _handleSelectedPickAPlanCodeDataLayer(selectedChoicePackage?: string): void {
        this._store
            .pipe(
                select(getCheckoutOffers),
                take(1),
                withLatestFrom(this._store.pipe(select(getPickAPlanSelectedOfferPackageName)), this._store.pipe(select(getIsPickAPlan))),
                concatMap(([offerModel, selectedPackage, isPickAPlan]) => {
                    if (isPickAPlan) {
                        const packageName = selectedPackage.includes('CHOICE') ? selectedChoicePackage : selectedPackage;
                        this.selectedChoicePackageName = packageName;
                        const selectedOfferPosition = offerModel.offers.findIndex((o) => o.packageName === packageName);
                        if (selectedOfferPosition !== -1) {
                            const offer = offerModel.offers[selectedOfferPosition];
                            this._store.dispatch(behaviorEventReactionPickAPlanSelected({ selected: { planCode: offer.planCode, price: offer.price } }));
                        }
                    }
                    return EMPTY;
                })
            )
            .subscribe();
    }

    private _listenForDisplayIneligibleLoader(): void {
        this.displayIneligibleLoader$
            .pipe(
                filter((x) => x),
                take(1),
                delay(5000),
                tap(() => this.displayIneligibleLoader$.next(false)),
                delay(1000)
            )
            .subscribe(() => {
                document.getElementById('notEligibleForStreamingPlanAlertPill')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
    }

    private _loadQuoteFrmUpdatedOffer() {
        const upgrade = this.upgrades ? this.upgrades.upgradeOffers.upgrade : null;
        this._store.dispatch(
            LoadQuoteFromUpdatedOffer({
                payload: {
                    account: this.account,
                    upgrade: upgrade,
                    formStep: this.formStep,
                },
            })
        );
    }

    private _addDefaultSteps(): void {
        this.purchaseSteps = [
            {
                titleKey: 'purchase.purchaseComponent.paymentInfoStepLabel',
                templates: {
                    active: this.paymentInfoTemplate,
                },
                id: PurchaseStepEnum.PaymentInfo,
                qatag: 'EditYourPaymentHeader',
            },
            {
                titleKey: 'purchase.purchaseComponent.reviewAndCompleteStepLabel',
                templates: {
                    active: this.reviewTemplate,
                },
                id: PurchaseStepEnum.Review,
                qatag: 'ReviewAndCompleteHeader',
            },
        ];

        this._store.dispatch(updatePurchaseFormSteps({ steps: this.purchaseSteps.map((stepData) => stepData.id) }));
    }

    private _addAccountLookupStep(index: number = 1): void {
        const accountLookupStep: PurchaseStep = {
            titleKey: 'purchase.purchaseComponent.yourAccountLabel',
            templates: {
                active: this.accountLookupStepTemplate,
                inactive: this.accountLookupStepTemplateInactive,
            },
            id: PurchaseStepEnum.AccountLookup,
            qatag: '',
        };
        this._addPurchaseStep(index, accountLookupStep);
    }

    private _addFlepzStep(index: number = 1): void {
        const flepzStep: PurchaseStep = {
            titleKey: 'purchase.purchaseComponent.verifyDeviceStepLabel',
            templates: {
                active: this.flepzTemplate,
                inactive: this.flepzTemplateInactive,
            },
            id: PurchaseStepEnum.Flepz,
            qatag: '',
        };
        this._addPurchaseStep(index, flepzStep);
    }

    private _addUpgradeStep(): void {
        const upgradeStepNum = this.isFlepz ? 3 : 2;
        const newUpgradeStep: PurchaseStep = {
            titleKey: 'purchase.purchaseComponent.packageUpsellStepLabel',
            templates: {
                active: this.upgradesTemplate,
            },
            id: PurchaseStepEnum.Upgrade,
            qatag: 'ChoosePackageHeader',
        };

        this._addPurchaseStep(upgradeStepNum, newUpgradeStep);
    }

    private _handleRtcRenewalsOffers(): void {
        this.selectedRenewalPlanCode$ = combineLatest([
            this._store.pipe(select(getRenewalPackageOptions)),
            this._store.pipe(select(getSelectedRenewalPackageName)),
            this._store.pipe(select(getDefaultRenewalPackageName)),
        ]).pipe(
            map(([renewalPackageOptions, selectedPackageName, defaultRenewalPackageName]) => {
                if (!!selectedPackageName || !!defaultRenewalPackageName) {
                    const packageName = selectedPackageName || defaultRenewalPackageName;
                    const selectedRenewalPackage = renewalPackageOptions?.find(
                        (option) => this._getPackageNameWithoutPlatForm(option.packageName) === this._getPackageNameWithoutPlatForm(packageName)
                    );
                    if (packageName?.indexOf('CHOICE') === -1) {
                        this._store.dispatch(
                            behaviorEventReactionRenewalPlanSelected({ selected: { planCode: selectedRenewalPackage?.planCode, price: selectedRenewalPackage?.price } })
                        );
                    }
                    return selectedRenewalPackage?.planCode;
                }
                return null;
            })
        );

        this.isRTC$
            .pipe(
                filter((isRTC) => isRTC),
                take(1),
                tap(() => {
                    this.verifyDeviceTabsToShowOverride = ['radio-info', 'account-info'];
                    const foundStepData = this._findPurchaseStep(PurchaseStepEnum.PaymentInfo);
                    foundStepData.step.titleKey += '_RTC';
                })
            )
            .subscribe();

        this.RTCOfferDetails$ = combineLatest([this._store.pipe(select(getRenewalPackageOptions)), this._store.pipe(select(getDefaultRenewalPackageName)), this.isRTC$]).pipe(
            mergeMap(([renewalOptions, defaultPackaName, isRTC]) =>
                iif(
                    () => isRTC,
                    of({
                        renewalPackages: renewalOptions
                            ? renewalOptions.map((pkg) => ({
                                  packageName: pkg.packageName,
                                  pricePerMonth: pkg.pricePerMonth,
                                  msrpPrice: pkg.msrpPrice,
                                  mrdEligible: pkg.mrdEligible,
                                  parentPackageName: pkg.parentPackageName,
                              }))
                            : [],
                        selectedPackage: defaultPackaName,
                    })
                )
            )
        );

        this.rtcData$ = this._store.pipe(
            select(getIsProactiveRtc),
            concatMap((isProactiveRtc) => {
                if (isProactiveRtc) {
                    return of(null);
                } else {
                    return this._store.pipe(
                        select(getRenewalPackageOptions),
                        filter((renewalOptions) => Array.isArray(renewalOptions) && renewalOptions.length > 0),
                        withLatestFrom(this._store.pipe(select(getDefaultRenewalPackageName))),
                        map(([renewalOptions, defaultPackaName]) => this._handleRtcDefaultData(renewalOptions ? renewalOptions : [], defaultPackaName)),
                        switchMap((data) =>
                            combineLatest([of(data), this._store.pipe(select(getSelectedRenewalPackageName)), this._store.pipe(select(getRenewalPackageOptions))])
                        ),
                        map(([data, selectedPackageName, renewalOptions]) => this._handleRtcSelectedPackage(data, selectedPackageName, renewalOptions)),
                        switchMap((data) => combineLatest([of(data), this._store.pipe(select(getAccountData))])),
                        map(([data, account]) => this._handleRtcAccountData(data, account))
                    );
                }
            })
        );
    }

    private _handleRtcAccountData(data: RtcData, account: AccountModel): RtcData {
        const accountPlans = getActivePlansOnAccount(account);
        const trialEndDate = accountPlans && accountPlans[0].endDate;
        if (data && data.planComparisonGridParams.trialEndDate !== trialEndDate) {
            data.planComparisonGridParams = {
                ...data.planComparisonGridParams,
                trialEndDate: accountPlans && accountPlans[0].endDate,
            };
        }
        if (data.renewalPlanSelectionData && data.renewalPlanSelectionData.selectedPackageName && data.renewalPlanSelectionData.packages) {
            this.selectedFollowOnIndex = data.renewalPlanSelectionData.packages.findIndex((pkg) => pkg.packageName === data.renewalPlanSelectionData.selectedPackageName);
            this._store.dispatch(SetSelectedRenewalPlan({ payload: { packageName: data.renewalPlanSelectionData.selectedPackageName } }));
        }
        return data;
    }

    private _handleRtcSelectedPackage(data: RtcData, selectedPackageName: string, renewalOptions: PackageModel[]): RtcData {
        if (
            selectedPackageName &&
            this._getPackageNameWithoutPlatForm(data.planComparisonGridParams.selectedPackageName) !== this._getPackageNameWithoutPlatForm(selectedPackageName)
        ) {
            const selectedRewalObj = renewalOptions.find((pkg) => pkg.packageName === selectedPackageName);
            const familyDiscount = getMrdDiscount(selectedRewalObj);
            const reviewSubscriptionOptions = {
                ...data.reviewSubscriptionOptions,
                selectedRenewalPackageName: selectedPackageName,
                monthlyPrice: selectedRewalObj.pricePerMonth,
            };
            const planComparisonGridParams = {
                ...data.planComparisonGridParams,
                familyDiscount,
                selectedPackageName,
            };
            const renewalPlanSelectionData = {
                ...data.renewalPlanSelectionData,
                selectedPackageName,
            };
            data.renewalPlanSelectionData = renewalPlanSelectionData;
            data.planComparisonGridParams = planComparisonGridParams;
            data.reviewSubscriptionOptions = reviewSubscriptionOptions;
        }
        return data;
    }

    private _handleRtcDefaultData(renewalOptions: PackageModel[], defaultPackaName: string): RtcData {
        if (!Array.isArray(renewalOptions) || renewalOptions.length === 0) {
            return null;
        }
        const packageObj = this.offer.offers[0];
        const selectedRenewalObj = renewalOptions.find((pkg) => pkg.packageName === defaultPackaName);
        const familyDiscount = getMrdDiscount(selectedRenewalObj);
        const renewalPackageNames = [];
        this._settedSelectedRenewalPackageName = defaultPackaName;
        const reviewSubscriptionOptions = {
            selectedRenewalPackageName: defaultPackaName,
            monthlyPrice: selectedRenewalObj.pricePerMonth,
            endDate: packageObj.planEndDate,
        };
        const planComparisonGridParams = {
            leadOfferTerm: packageObj.termLength,
            familyDiscount,
            selectedPackageName: defaultPackaName,
            leadOfferPackageName: defaultPackaName,
        };
        const renewalPlanSelectionData = {
            leadOfferEndDate: packageObj.planEndDate,
            packages: [],
            selectedPackageName: defaultPackaName,
            leadOfferPackageName: defaultPackaName,
        };

        renewalOptions.forEach((pkg) => {
            renewalPackageNames.push(pkg.packageName);
            renewalPlanSelectionData.packages.push({
                packageName: pkg.packageName,
                pricePerMonth: pkg.pricePerMonth,
                planCode: pkg.planCode,
                price: pkg.price,
            });
        });

        const retailPrices: RetailPriceAndMrdEligibility[] = renewalOptions.map((offer) => ({ pricePerMonth: offer.pricePerMonth, mrdEligible: offer.mrdEligible }));

        return {
            reviewSubscriptionOptions,
            renewalPackageNames,
            planComparisonGridParams,
            renewalPlanSelectionData,
            retailPrices,
        };
    }

    private _addPurchaseStep(num: number, stepData: PurchaseStep): void {
        const foundStepData = this._findPurchaseStep(stepData.id);
        if (foundStepData) {
            if (!(foundStepData.index === num - 1)) {
                this.purchaseSteps.splice(foundStepData.index, 1);
                this.purchaseSteps.splice(num - 1, 0, stepData);
            }
        } else {
            this.purchaseSteps.splice(num - 1, 0, stepData);
        }
        this._store.dispatch(updatePurchaseFormSteps({ steps: this.purchaseSteps.map((s) => s.id) }));
        this._updateOfferDetailsCopyOptions();
    }

    private _updatePurchaseStepTitles(): void {
        //TODO: add the other step titles once required
        const upgradeStep = this._findPurchaseStep(PurchaseStepEnum.Upgrade);
        if (upgradeStep && upgradeStep.step) {
            upgradeStep.step.titleKey = 'purchase.purchaseComponent.packageUpsellStepLabel';
        }
    }

    private _removePurchaseStep(id: PurchaseStepEnum): void {
        const foundStepData = this._findPurchaseStep(id);
        foundStepData && this.purchaseSteps.splice(foundStepData.index, 1);
        this._store.dispatch(updatePurchaseFormSteps({ steps: this.purchaseSteps.map((stepData) => stepData.id) }));

        this._setStepNumberForErrorRedirects();
        this._updateOfferDetailsCopyOptions();
    }

    private _getCurrentStep(): PurchaseStep {
        return this.purchaseSteps[this.formStep - 1];
    }

    private _updateStepsHash(step: number): void {
        this._stepsHashArray = [];
        this._stepsHashArray[step] = 1;
    }

    private _scrollToStep(step: PurchaseStepEnum): void {
        if (this.stepElements) {
            let stepToScrollTo: ElementRef;
            stepToScrollTo = this.stepElements.find((el) => {
                return el.nativeElement.id === `${step}-step`;
            });
            if (stepToScrollTo) {
                scrollToElement(stepToScrollTo);
            }
        }
    }

    private _findPurchaseStep(id: PurchaseStepEnum): { step: PurchaseStep; index: number } | null {
        let foundIndex: number;
        const foundStep = this.purchaseSteps.find((pStep, index) => {
            if (pStep.id === id) {
                foundIndex = index;
                return true;
            }
            return false;
        });
        if (foundStep) {
            return {
                step: foundStep,
                index: foundIndex,
            };
        } else {
            null;
        }
    }

    private _updateDataLayer(step: number) {
        let flowName: FlowNameEnum = FlowNameEnum.Checkout;
        let componentName: ComponentNameEnum = null;
        const currentStepId: PurchaseStepEnum = this.purchaseSteps[step - 1].id;

        switch (currentStepId) {
            case PurchaseStepEnum.Flepz:
                flowName = FlowNameEnum.Authenticate;
                componentName = ComponentNameEnum.FlepzSearch;
                break;
            case PurchaseStepEnum.PaymentInfo:
                componentName = ComponentNameEnum.PaymentInfo;
                break;
            case PurchaseStepEnum.GenreSelection:
                componentName = ComponentNameEnum.ChooseGenre;
                break;
            case PurchaseStepEnum.Upgrade:
                componentName = ComponentNameEnum.Upgrade;
                break;
            case PurchaseStepEnum.Review:
                componentName = ComponentNameEnum.Review;
                this._buildDataLayerPlanInfoProducts();
                break;
            case PurchaseStepEnum.AccountLookup:
                flowName = FlowNameEnum.Authenticate;
                componentName = ComponentNameEnum.AccountLookup;
                break;
            default:
                componentName = null;
                break;
        }
        if (componentName) {
            this._dataLayerSrv.updateAndSendPageTrackEvent(DataLayerDataTypeEnum.PageInfo, componentName, { flowName: flowName, componentName: componentName });
        }
    }

    private _buildDataLayerPlanInfoProducts(): void {
        const planInfoObj: any = this._dataLayerSrv.getData(DataLayerDataTypeEnum.PlanInfo) || {};
        const accountObj: any = this._account;

        let isUpdated: boolean = false;
        if (this._isTokenizedLink || this._isFlepz) {
            planInfoObj['products'] = {};

            if (accountObj && accountObj.subscriptions[0]) {
                // Subscription ID (CMN-ANA-PLA-010)
                planInfoObj.subscriptionId = accountObj.subscriptions[0].id;
                // Current plans (CMN-ANA-PLA-120)
                if (accountObj.subscriptions[0].plans[0]) {
                    planInfoObj['products'].currentPlanCode = accountObj.subscriptions[0].plans[0].code;
                }
                isUpdated = true;
            }
            if (this.upgrades) {
                // Plans offer (CMN-ANA-PLA-020, CMN-ANA-PLA-030)
                if (this.upgrades.originalOffer && this.upgrades.originalOffer.length === 1) {
                    const orgOfferPackage: PackageModel = this.upgrades.originalOffer[0];
                    planInfoObj['products'].originalOffer = { planCode: orgOfferPackage.planCode, price: orgOfferPackage.price };
                    isUpdated = true;
                }
                // Upsell offers (CMN-ANA-PLA-110)
                if (this.upgrades.upgradeOffers && this.upgrades.upgradeOffers.upgrade && this.upgrades.upgradeOffers.upgrade.length > 0) {
                    const upsellOffersArr = (planInfoObj['products'].upsellOffers = []);
                    this.upgrades.upgradeOffers.upgrade.forEach((upsellOfferPack: PackageModel) => {
                        upsellOffersArr.push({ planCode: upsellOfferPack.planCode, price: upsellOfferPack.price });
                    });
                    isUpdated = true;
                }
            }
        }

        if (isUpdated) {
            this._dataLayerSrv.update(DataLayerDataTypeEnum.PlanInfo, planInfoObj);
        }
    }

    private _addTransactionId2CustomerInfo(): void {
        const customerInfoObj: CustomerInfoData = this._dataLayerSrv.getData(DataLayerDataTypeEnum.CustomerInfo) || {};
        customerInfoObj.transactionId = this.transactionId;
        this._dataLayerSrv.update(DataLayerDataTypeEnum.CustomerInfo, customerInfoObj);
    }

    private _buildDataLayerCustomerInfo(pvtTime: string): void {
        const customerInfoObj: CustomerInfoData = this._dataLayerSrv.getData(DataLayerDataTypeEnum.CustomerInfo) || {};
        const accountObj: any = this._account;

        if ((this._isTokenizedLink || this._isFlepz) && accountObj) {
            customerInfoObj.firstName = accountObj.firstName;
            customerInfoObj.email = accountObj.email;

            if (this._isTokenizedLink) {
                if (this._urlHelperService.getCaseInsensitiveParam(this._route.snapshot.queryParamMap, QueryParamEnum.Token)) {
                    customerInfoObj.authenticationType = AuthenticationTypeEnum.TokenURL;
                } else if (
                    this._urlHelperService.getCaseInsensitiveParam(this._route.snapshot.queryParamMap, QueryParamEnum.RadioID) &&
                    this._urlHelperService.getCaseInsensitiveParam(this._route.snapshot.queryParamMap, QueryParamEnum.Account)
                ) {
                    customerInfoObj.authenticationType = AuthenticationTypeEnum.RidAcctURL;
                } else if (
                    this._urlHelperService.getCaseInsensitiveParam(this._route.snapshot.queryParamMap, QueryParamEnum.RadioID) &&
                    this._urlHelperService.getCaseInsensitiveParam(this._route.snapshot.queryParamMap, QueryParamEnum.LastName)
                ) {
                    customerInfoObj.authenticationType = AuthenticationTypeEnum.RidLnameURL;
                }
            } else if (this._isFlepz) {
                customerInfoObj.authenticationType = AuthenticationTypeEnum.Flepz;
            }

            customerInfoObj.customerType = inTrialPostTrialSelfPayCustomerType(accountObj, pvtTime, this.isStudentFlow);
        }

        this._dataLayerSrv.update(DataLayerDataTypeEnum.CustomerInfo, customerInfoObj);
    }

    private _generateNewCCTransaction(): void {
        this.transactionId = 'OAC-' + uuid();
        this._addTransactionId2CustomerInfo();

        this._store.dispatch(AddCCTransactionId({ payload: { transactionId: this.transactionId } }));

        const newTransactionEvent = new CustomEvent(CustomEventNameEnum.NewPaymentTransaction, {
            detail: {
                id: this.transactionId,
                message: 'New credit card transaction event',
                time: new Date(),
            },
            bubbles: true,
            cancelable: true,
        });
        this._window.dispatchEvent(newTransactionEvent);
    }

    private _updateOfferDetailsCopyOptions(): void {
        const step = this.purchaseSteps[this.formStep - 1];
        if (!!step) {
            this.offerDetailsCopyOptions = {
                showLegalCopy: step.id === 'accordion-review',
                showPriceChangeCopy: step.id === 'accordion-review',
            };
        }
    }

    private _scrollToActiveStep() {
        scrollToElementBySelector('.accordion-item .active');
    }

    private _listenForChoicePackages() {
        this.getAddGenreStep$.pipe(takeUntil(this._unsubscribe)).subscribe((containsChoice) => {
            if (containsChoice) {
                const step: PurchaseStep = {
                    titleKey: 'purchase.purchaseComponent.choiceGenreFormLabel',
                    templates: {
                        active: this.choiceGenreSelectionTemplate,
                        inactive: this.choiceGenreSelectionInactiveTemplate,
                    },
                    id: PurchaseStepEnum.GenreSelection,
                    qatag: 'choiceGenreForm',
                };

                this._addPurchaseStep(1, step);
            }
        });
    }

    choiceGenreFollowOnStepComplete(packageName: string) {
        this.onSelectedFollowOn(packageName);
        this._store.dispatch(ChangeStep({ payload: this.formStep + 1 }));
    }

    onSelectedPickAPlanChoicePlan(packageName: string): void {
        this.selectedChoicePackageName = packageName;
        this._handleSelectedPickAPlanCodeDataLayer(packageName);
        this._store.dispatch(SetSelectedOfferPackageName({ payload: { packageName } }));
        this._store
            .pipe(
                select(getCheckoutOffers),
                take(1),
                concatMap((offerModel) => {
                    const selectedOfferPosition = offerModel.offers.findIndex((o) => o.packageName === packageName);
                    this._store.dispatch(LoadSelectedChoicePlan({ payload: { ...offerModel, offers: [offerModel.offers[selectedOfferPosition]] } }));
                    return EMPTY;
                })
            )
            .subscribe();
    }

    choiceGenreOfferSelectionStepComplete(packageName: string) {
        this.onSelectedPickAPlanChoicePlan(packageName);
        this._store.dispatch(ChangeStep({ payload: this.formStep + 1 }));
    }

    choiceGenreSelectionStepComplete(packageName: string) {
        this.isRTC$
            .pipe(
                take(1),
                tap((isRTC) => {
                    isRTC ? this.choiceGenreFollowOnStepComplete(packageName) : this.choiceGenreOfferSelectionStepComplete(packageName);
                })
            )
            .subscribe();
    }

    // NOTE: this is for the CMS powered upsell component where it just handles display and upsell choice
    //       and the handling of the capture of the selection is done here (which ideally should be handled
    //       in feature state but that work that will be done when this gets refactored).
    selectUpsellOrClear(planCode: string | null) {
        if (this.isStreaming) {
            // Need to call eligibility check
            this._listenForDisplayIneligibleLoader();
            this._checkIfStreamingPlanCodeIsEligibleWorkflowService
                .build(planCode) // NOTE: we are passing in planCode here because feature state does not have selected plan code set yet
                .pipe(
                    tap((eligibleForOffer) => this.displayIneligibleLoader$.next(!eligibleForOffer)),
                    concatMap((eligible) =>
                        eligible
                            ? of({ eligible, planCode })
                            : this._loadCustomerFallbackOfferForFailedStreamingEligibilityWorkflowService
                                  .build()
                                  .pipe(map((fallbackPlanCode) => ({ eligible, planCode: fallbackPlanCode })))
                    )
                )
                .subscribe(({ eligible, planCode: planCodeToUse }) => {
                    if (eligible) {
                        // we are good to select the upsell or clear the selection, so continue with that logic
                        // NOTE: these actions result in the quote getting loaded and the step changing
                        this._applyUpsellSelection(planCodeToUse);
                    } else {
                        // NOTE: the LoadQuote action results in the quote getting loaded and the step changing
                        const radioId = getRadioIdFromAccount(this.account);
                        const subscriptionId = getSubscriptionIdFromAccount(this.account);
                        this._store.dispatch(
                            LoadQuote({
                                payload: {
                                    planCodes: [planCodeToUse],
                                    ...(radioId && { radioId }),
                                    ...(subscriptionId && { subscriptionId }),
                                },
                            })
                        );
                    }
                });
        } else {
            this._applyUpsellSelection(planCode);
        }
    }

    private _applyUpsellSelection(planCode: string | null) {
        if (!!planCode) {
            this._store.dispatch(upsellPlanCodeSelected({ planCode }));
        } else {
            this._store.dispatch(upsellPlanCodeUnselected());
            this._store.dispatch(LoadSelectedOffer({ payload: null }));
            this._store.dispatch(SelectedUpsell({ payload: null }));
            this._store.dispatch(ClearUpsell());
        }
        this._upsellPlanCodeBeingConsidered$.next(null);
    }

    swapOfferInfoBasedOnUpsellBeingConsidered(planCode: string) {
        this._upsellPlanCodeBeingConsidered$.next(planCode);
    }

    onSelectedPlanCodeEligibilityFromNonCMSUpsell(eligibleForOffer: boolean) {
        this._listenForDisplayIneligibleLoader();
        this.displayIneligibleLoader$.next(!eligibleForOffer);
    }

    private _getPackageNameWithoutPlatForm(packageName: string): string {
        if (packageName) {
            return packageName.replace(/^(1_|SXM_|3_)/, '');
        }
        return packageName;
    }

    onMarketingPromoRedeemed() {
        this._store
            .select(getCheckoutState)
            .pipe(
                filter((state: CheckoutState) => !state.loading),
                take(1),
                withLatestFrom(this._store.select(getCheckoutOffers)),
                tap(([state, offer]) =>
                    this._store.dispatch(
                        LoadFlepzDataSuccess({
                            payload: {
                                offer,
                                programCode: this.programCode ? this.programCode : null,
                                ...(this.isStudentFlow ? { account: this._account } : null),
                            },
                        })
                    )
                )
            )
            .subscribe();
    }
}