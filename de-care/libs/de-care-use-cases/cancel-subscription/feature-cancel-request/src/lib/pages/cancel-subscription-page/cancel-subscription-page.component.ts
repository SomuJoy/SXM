import { Component, OnInit, ChangeDetectionStrategy, Inject, ViewChild, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
    setCancelReason,
    getCurrentPlanSummary,
    getFollowonPlan,
    getMultiPackageData,
    setPlanCode,
    clearPlanCode,
    getCancellationDetails,
    ProcessCancelOffersWorkflowService,
    ProcessCancelConfirmationWorkflowService,
    getOffersAreAvailable,
    getWillBeCancelledLater,
    displayAdditionalBillingTerms,
    getIsChatOpen,
    getChatHourClosed,
    calculateUTCDayHour,
    setCurrentUTCDayHour,
    getCancelOnly,
    getOfferTypeForOfferDetails,
    getSavingsInfo,
    getCancelOfferGridFlagValue,
    getGridSelectionVM,
    getOfferGridVM,
    setSelectedPackageNameFromOfferGrid,
    getPlanCodeFromSelectedGridPackageName,
    getNumGridOffers,
    getChoiceGenrePackageOptions,
    getIsSelectedGridPackageChoice,
    preSelectedPlanDisplayed,
    getMultiOfferSelectionData,
    getPreSelectedOfferPlanCodeAndPrice,
    getCurrentSubscriptionIsStreamingOnly,
    getPreSelectedOfferDetailsForTracking,
    getContainsVipSubscription,
    getVipIncludedButNotSelected,
    getSubscriptionId,
    getSubscriptionCancelOptions,
    getEnablePreSelectedPlan,
    getEnablePreSelectedSecondPlan,
    getCancelStepsFlags,
    getToSkipStepsAndGoToCancelSummary,
    getSubscriptionWithTrialAndFollowon,
    getAllowGoBackToOffers,
    getIs247ChatOpen,
    getNewOfferExperienceDetails,
    getPlanIsSelectedFromGrid,
} from '@de-care/de-care-use-cases/cancel-subscription/state-cancel-request';
import { CdkStepper } from '@angular/cdk/stepper';
import { tap, map, withLatestFrom, takeUntil, take, concatMap, finalize } from 'rxjs/operators';
import { Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { LANGUAGE_CODES, SettingsService } from '@de-care/settings';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import {
    behaviorEventImpressionForPage,
    behaviorEventImpressionForComponent,
    behaviorEventReactionCancelPlanReason,
    behaviorEventReactionForPreselectedPlan,
} from '@de-care/shared/state-behavior-events';
import { pageDataStartedLoading, pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { AdditionalGridRowModel } from '@de-care/shared/sxm-ui/ui-plan-comparison-grid';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from 'uuid/v4';

enum CancelSteps {
    CANCEL_REASONS = 0,
    INTERSTITIAL_PAGE = 1,
    PRESELECTED_PLANS = 2,
    PRESENT_OFFERS = 3,
    CANCEL_SUMMARY = 4,
    CANCEL_CONFIRMATION = 5,
}
@Component({
    selector: 'de-care-cancel-subscription-page',
    templateUrl: './cancel-subscription-page.component.html',
    styleUrls: ['./cancel-subscription-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelSubscriptionPageComponent implements OnInit, OnDestroy {
    @ViewChild('cancelStepper') private readonly _stepper: CdkStepper;
    isProcessingOffers = false;
    isProcessingCancellation = false;
    showAcceptOfferFlow = false;
    acceptFlowStepIndex = 0;
    translateKeyPrefix = 'deCareUseCasesCancelSubscriptionFeatureCancelRequest.cancelSubscriptionPageComponent.';
    heroTranslateKey = 'CANCEL_STEP_REASON';
    showOfferDetails = false;
    noOfferSelectedError = false;
    offersAreAvailable = true;
    oacUrl = this._settingsSrv.settings.oacUrl;

    /* Plan Grid variables */
    showOfferGrid = false;
    showOfferCurrentSubscription = true;
    showHero = true;
    showOfferHero = true;
    selectedGridIndex = 0;
    selectedGridPackageIsChoice: boolean;
    showGenreModal = false;
    enablePreSelectedPlan = false;
    enablePreSelectedSecondPlan = false;
    fullWidthSteps = false;
    subscriptionIsStreaming = false;
    showChatLinkForCancelButton = false;
    enableCancelInterstitial = false;
    stepAfterCancelReasons = 0;
    yourCurrentPlan$ = this._store.pipe(select(getCurrentPlanSummary));
    followonPlan$ = this._store.pipe(select(getFollowonPlan));
    savingsInfo$ = this._store.pipe(select(getSavingsInfo));
    multiPackageData$ = this._store.pipe(select(getMultiPackageData));
    multiOfferSelectionData$;
    isChatOpen$ = this._store.pipe(select(getIsChatOpen));
    is247ChatOpen$ = this._store.select(getIs247ChatOpen);
    chatHourClosed$ = this._store.pipe(select(getChatHourClosed));
    displayAdditionalBillingTerms$ = this._store.pipe(select(displayAdditionalBillingTerms));
    cancellationDetails$ = this._store.pipe(select(getCancellationDetails));
    willBeCancelledLater$ = this._store.pipe(select(getWillBeCancelledLater));
    preSelectedPlanInfo$ = this._store.pipe(select(getPreSelectedOfferPlanCodeAndPrice));
    vipIncludedButNotSelected$ = this._store.pipe(select(getVipIncludedButNotSelected));
    hasSubscriptionWithTrailAndFollowon$ = this._store.pipe(select(getSubscriptionWithTrialAndFollowon));
    cancelOptions$ = this._store.select(getSubscriptionId).pipe(concatMap((subscriptionId) => this._store.select(getSubscriptionCancelOptions(subscriptionId))));
    allowGoBackToOffers$ = this._store.select(getAllowGoBackToOffers).pipe(map((allowGoBackToOffers) => this.offersAreAvailable && allowGoBackToOffers));
    /* Plan grid observables */
    presentOfferGrid$ = this._store.pipe(select(getCancelOfferGridFlagValue));
    presentTestOfferExperience = false; //TODO: Bind it with selector once it is implemented
    numGridOffers$ = this._store.pipe(select(getNumGridOffers));
    gridSelectionVM$ = this._store.pipe(select(getGridSelectionVM));
    offerGridVM$ = this._store.pipe(select(getOfferGridVM));
    planCodeFromSelectedGridPackageName$ = this._store.pipe(select(getPlanCodeFromSelectedGridPackageName));
    isSelectedGridPackageChoice$ = this._store.pipe(select(getIsSelectedGridPackageChoice));
    newOfferExperienceDetails$ = this._store.select(getNewOfferExperienceDetails);
    // NOTE: this will get updated to a selector that will getChoiceGenrePackageOptions once CMS integration is done.
    choiceGenrePackageOptions$ = combineLatest([this._store.select(getChoiceGenrePackageOptions), this._translateService.stream('app.packageDescriptions')]).pipe(
        map(([packageNames, packageDescriptions]) =>
            packageNames.map((packageName) => ({
                label: packageDescriptions[packageName].shortName,
                value: packageName,
                tooltipTitle: packageDescriptions[packageName].channels[0].title,
                tooltipText: packageDescriptions[packageName].channels[0].descriptions,
            }))
        )
    );

    private _destroy$: Subject<boolean> = new Subject<boolean>();
    currentLang$ = this._translateService.onLangChange.pipe(
        takeUntil(this._destroy$),
        tap(() => this.subjectLangChange$.next(true)),
        map((lang) => lang.lang)
    );
    subjectLangChange$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    cancelOnly$ = this._store.pipe(select(getCancelOnly));
    getOfferTypeForOfferDetails$ = this._store.pipe(select(getOfferTypeForOfferDetails));

    isCanadaMode = this._settingsSrv.isCanadaMode;
    isCanadaFrenchLangMode = false;
    isUSLangMode = false;
    isCanadaEnglishLangMode = false;

    isInChatLinkStage = false;
    cancelReasons = [];
    vipWhereToListenGridRow: AdditionalGridRowModel[];
    containsVipSubscription = false;
    offersStepActive = false;
    planIsSelectedFromGrid = false;
    //TODO: Temporary flag to show/hide cancel reasons page.
    skipReasonsStep = false;

    showGenreModalAriaDescribedbyTextId = uuid();

    private readonly _window: Window;

    constructor(
        private readonly _store: Store,
        private readonly _processCancelOffersWorkflowService: ProcessCancelOffersWorkflowService,
        private readonly _processCancelConfirmationWorkflowService: ProcessCancelConfirmationWorkflowService,
        private readonly _settingsSrv: SettingsService,
        @Inject(DOCUMENT) private readonly _document: Document,
        private readonly _translateService: TranslateService,
        private readonly _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
        this._window = this._document && this._document.defaultView;
        this.setCurrentLanguageMode(this._translateService.currentLang);

        this.currentLang$.pipe(takeUntil(this._destroy$)).subscribe((lang) => this.setCurrentLanguageMode(lang));
    }

    ngOnInit(): void {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CANCEL_SUB', componentKey: 'reasons' }));
        this._store.dispatch(pageDataFinishedLoading());
        this.skipReasonsStep ? this.onCancelReasonSubmitted('OTHER') : this._getCancelReasons();

        // Preparing multiOffer data
        this.multiOfferSelectionData$ = this._store.pipe(
            select(getMultiOfferSelectionData),
            map((packageData) => {
                const mainOffers = packageData.mainPackageData.map((packageData) => {
                    const fieldLabelTranslateKey = packageData.isSamePackage ? 'OFFER_CONTENT_CARD_HEADLINE2' : 'OFFER_CONTENT_CARD_HEADLINE1';
                    return {
                        ...(packageData.isBestPackage && {
                            headlineFlagCopy: this._translateService.instant(`${this.translateKeyPrefix}OFFER_CONTENT_CARD_FLAG`),
                        }),
                        fieldLabel: this._translateService.instant(`${this.translateKeyPrefix}${fieldLabelTranslateKey}`),
                        planCodeOptions: [{ planCode: packageData.planCode }],
                        packageData: packageData.data,
                    };
                });
                return {
                    mainOffers,
                };
            })
        );

        // Plan grid offers
        this.presentOfferGrid$.pipe(takeUntil(this._destroy$)).subscribe((value) => {
            if (value && value.flag) {
                this.showOfferGrid = value.flag.grid;
                this.showOfferHero = value.flag.hero;
                this.showOfferCurrentSubscription = !this.showOfferGrid;
            }
        });

        this._store
            .pipe(
                select(getSubscriptionId),
                concatMap((subscriptionId) => this._store.select(getCancelStepsFlags(subscriptionId))),
                takeUntil(this._destroy$)
            )
            .subscribe((value) => {
                this.enableCancelInterstitial = value?.enableInterstitalStep;
                const combinedFlags = Object.values(value)
                    .map((x) => +x || 0)
                    .reduce((a, b) => 10 * a + b); // mapping combined options to numbers

                switch (combinedFlags) {
                    case 0: // no interstitial and no special offer and no cancel summary
                        this.stepAfterCancelReasons = CancelSteps.PRESENT_OFFERS;
                        break;
                    case 100: // only Cancel Summary
                        this.stepAfterCancelReasons = CancelSteps.CANCEL_SUMMARY;
                        break;
                    case 110: // cancel summary and special offer
                    case 10: // only special offer
                        this.stepAfterCancelReasons = CancelSteps.PRESELECTED_PLANS;
                        break;
                    case 1: // only interstitial
                    case 11: // interstitial and special offer
                    case 111: // cancel summary and interstitial and special offer
                        this.stepAfterCancelReasons = CancelSteps.INTERSTITIAL_PAGE;
                        break;
                }
            });

        this._store
            .pipe(select(getEnablePreSelectedPlan))
            .pipe(takeUntil(this._destroy$))
            .subscribe((value) => {
                this.enablePreSelectedPlan = value;
            });

        this._store
            .pipe(select(getEnablePreSelectedSecondPlan))
            .pipe(takeUntil(this._destroy$))
            .subscribe((value) => {
                this.enablePreSelectedSecondPlan = value;
            });
        // sets the planCode when a package is selected from the offer grid
        this.planCodeFromSelectedGridPackageName$.pipe(takeUntil(this._destroy$)).subscribe((planCode) => this._store.dispatch(setPlanCode({ planCode })));
        this.isSelectedGridPackageChoice$.pipe(takeUntil(this._destroy$)).subscribe((isChoice) => (this.selectedGridPackageIsChoice = isChoice));

        // Additional "where to listen" grid row required by the VIP subscriptions. Copies are static, could require update if returned offers features change.
        this._store
            .pipe(select(getContainsVipSubscription))
            .pipe(takeUntil(this._destroy$))
            .subscribe((containsVip) => {
                this.containsVipSubscription = containsVip;
                if (containsVip) {
                    this.vipWhereToListenGridRow = [
                        {
                            title: this._translateService.instant(`${this.translateKeyPrefix}WHERE_TO_LISTEN`),
                            tooltip: this._translateService.instant(`${this.translateKeyPrefix}LISTEN_2_CAR_TOOLTIP`),
                            columns: [
                                { label: this._translateService.instant(`${this.translateKeyPrefix}BOTH_APP_AND_2_CAR`) },
                                { label: this._translateService.instant(`${this.translateKeyPrefix}BOTH_APP_AND_1_CAR`) },
                                { label: this._translateService.instant(`${this.translateKeyPrefix}BOTH_APP_AND_1_CAR`) },
                            ],
                        },
                    ];
                } else {
                    this.vipWhereToListenGridRow = null;
                }
            });
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    setCurrentLanguageMode(lang: string) {
        switch (lang) {
            case LANGUAGE_CODES.EN_CA:
                this.isCanadaEnglishLangMode = true;
                this.isCanadaFrenchLangMode = false;
                this.isUSLangMode = false;
                break;
            case LANGUAGE_CODES.FR_CA:
                this.isCanadaFrenchLangMode = true;
                this.isCanadaEnglishLangMode = false;
                this.isUSLangMode = false;
                break;
            default:
                this.isUSLangMode = true;
                this.isCanadaFrenchLangMode = false;
                this.isCanadaEnglishLangMode = false;
                break;
        }
    }

    dispatchOfferImpression() {
        this.offersAreAvailable
            ? this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'offers' }))
            : this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'no-offers' }));
    }

    dispatchPreSelectedPlanImpression() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'offers' }));
        this._store.dispatch(preSelectedPlanDisplayed());
    }

    dispatchSummaryImpression() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'summary' }));
    }

    dispatchSetCurrentUTCDayHour() {
        this._store.dispatch(setCurrentUTCDayHour({ currentUTCDayHour: calculateUTCDayHour() }));
    }

    onCancelReasonStepActive() {
        this.skipReasonsStep ? this._store.dispatch(pageDataStartedLoading()) : (this.heroTranslateKey = 'CANCEL_STEP_REASON');
    }

    onInterstitialStepActive() {
        this.showHero = false;
        this.fullWidthSteps = true;
        this.showOfferDetails = false;
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'streamnowinterstitial' }));
    }

    onOffersStepActive() {
        this.fullWidthSteps = false;
        this.heroTranslateKey = 'CANCEL_STEP_OFFERS';
        this.dispatchOfferImpression();
        this.isInChatLinkStage = true;
        this.showHero = this.showOfferHero || !this.offersAreAvailable;
        this.showOfferCurrentSubscription = !this.showOfferGrid || !this.offersAreAvailable;
        this.offersStepActive = true;
    }

    onCancelSummaryStepActive() {
        this.heroTranslateKey = 'CANCEL_STEP_SUMMARY';
        this.dispatchSummaryImpression();
        this.showHero = true;
        this.showOfferDetails = false;
        this.fullWidthSteps = false;
    }

    onConfirmationStepActive() {
        this.heroTranslateKey = 'CANCEL_STEP_CONFIRMATION';
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'cancelConfirmation' }));
    }

    onPackageClicked(planCode: string) {
        this._store.dispatch(setPlanCode({ planCode }));
        this.noOfferSelectedError = false;
    }

    onOfferSelected(planCode) {
        if (planCode) {
            this._store.dispatch(setPlanCode({ planCode }));
            this.showAcceptOfferFlow = true;
            this.acceptFlowStepIndex = 1;
        } else {
            this.noOfferSelectedError = true;
        }
    }

    onEditPackageStep() {
        this.dispatchSetCurrentUTCDayHour();
        this.showAcceptOfferFlow = false;
        this.acceptFlowStepIndex = 0;
        this.dispatchOfferImpression();
        this.showHero = this.showOfferHero || !this.offersAreAvailable;
        if (this.enablePreSelectedPlan || this.enablePreSelectedSecondPlan || this.enableCancelInterstitial) {
            this.fullWidthSteps = true;
            this.showHero = false;
        }
        this.offersStepActive = true;
    }

    onDeclineOffers() {
        this.offersStepActive = false;
        this.showOfferDetails = false;
        this._stepper.selectedIndex = CancelSteps.CANCEL_SUMMARY;
    }

    onGoBackToOffers() {
        this.dispatchSetCurrentUTCDayHour();
        this._store.dispatch(clearPlanCode());
        if (this.enablePreSelectedPlan || this.enablePreSelectedSecondPlan) {
            this._stepper.selectedIndex = CancelSteps.PRESELECTED_PLANS;
        } else {
            this._stepper.selectedIndex = CancelSteps.PRESENT_OFFERS;
        }
        this.showAcceptOfferFlow = false;
        this.showOfferDetails = true;
    }

    onCancelReasonSubmitted(cancelReason: string) {
        this._store.dispatch(setCancelReason({ cancelReason }));
        this._store.dispatch(behaviorEventReactionCancelPlanReason({ reason: cancelReason }));
        this.isProcessingOffers = true;
        this._processCancelOffersWorkflowService
            .build()
            .pipe(
                withLatestFrom(
                    combineLatest(
                        this._store.pipe(select(getOffersAreAvailable)),
                        this._store
                            .pipe(select(getToSkipStepsAndGoToCancelSummary))
                            .pipe(finalize(() => this.skipReasonsStep && this._store.dispatch(pageDataFinishedLoading()))),
                        this.cancelOptions$
                    )
                )
            )
            .subscribe({
                next: ([, [offersAreAvailable, canGoToCancelSummary, cancelOptions]]) => {
                    this.isProcessingOffers = false;
                    this.showOfferDetails = this.offersAreAvailable = offersAreAvailable;
                    this.dispatchSetCurrentUTCDayHour();
                    canGoToCancelSummary ? (this._stepper.selectedIndex = CancelSteps.CANCEL_SUMMARY) : (this._stepper.selectedIndex = this.stepAfterCancelReasons);
                },
                error: () => {
                    this.showOfferCurrentSubscription = true;
                    this.offersAreAvailable = false;
                    this.showOfferDetails = true;
                    this._stepper.selectedIndex = this.enableCancelInterstitial ? CancelSteps.INTERSTITIAL_PAGE : CancelSteps.PRESENT_OFFERS;
                    this.isProcessingOffers = false;
                },
            });
    }
    onCancelSubscription() {
        this.isProcessingCancellation = true;
        this._processCancelConfirmationWorkflowService
            .build()
            .pipe(tap(() => (this.isProcessingCancellation = true)))
            .subscribe({
                next: () => {
                    this.isProcessingCancellation = false;
                    this.fullWidthSteps = false;
                    this._stepper.selectedIndex = CancelSteps.CANCEL_CONFIRMATION;
                },
                error: () => {
                    this.isProcessingCancellation = false;
                },
            });
    }

    onCancelPlanFromPreselected() {
        this.fullWidthSteps = false;
        this._stepper.selectedIndex = CancelSteps.CANCEL_SUMMARY;
    }

    backToMyAccount() {
        // TODO we want to move away from using a isCanadaMode logic check here and instead either:
        // Leverage translate resource keys since that understands Ca or not (can have an entry key "BACK_TO_ACCOUNT": { "URL": "", "TYPE": "ROUTER" } and use TYPE of "ROUTER" or "EXTERNAL")
        // OR...have a feature state view model selector property to tell the UI how to handle backToMyAccount
        if (this.isCanadaMode) {
            this._window.location.href = `${this._settingsSrv.settings.oacUrl}login_view.action?reset=true`;
        } else {
            this._window.location.href = this._window.location.href.replace(this._router.url, '/account/manage/dashboard');
        }
    }

    onGridSelectedPackageName(packageName: string) {
        this._store.dispatch(setSelectedPackageNameFromOfferGrid({ packageName }));
    }
    onOfferGridContinue() {
        if (this.selectedGridIndex === 0) {
            this.backToMyAccount();
        } else {
            if (this.selectedGridPackageIsChoice) {
                this.showGenreModal = true;
            } else {
                this._gridSelectionComplete();
            }
        }
    }
    genreModalClosed() {
        this.showGenreModal = false;
    }
    setSelectedGenre(packageName: string): void {
        this._store.dispatch(setSelectedPackageNameFromOfferGrid({ packageName }));
        this.showGenreModal = false;
        this._gridSelectionComplete();
    }

    onPreSelectedPlanActive() {
        this.showHero = false;
        this.fullWidthSteps = true;
        this.showOfferDetails = true;
        this._store.pipe(select(getPreSelectedOfferDetailsForTracking), take(1)).subscribe((plan) => {
            if (this.enablePreSelectedPlan || this.enablePreSelectedSecondPlan) {
                this._store.dispatch(
                    // TODO: Only one plan is presented in the preselected page even though there are multiple plans in the offer
                    behaviorEventReactionForPreselectedPlan({
                        audioPackage: { planCode: plan?.planCode, price: plan?.price, packageName: plan?.packageName },
                    })
                );
                this.dispatchPreSelectedPlanImpression();
            }
        });
    }

    onGetPreSelectedPlan() {
        this._store.dispatch(setPlanCode({ planCode: 'Streaming Music Showcase - 1mo' }));
        this.showAcceptOfferFlow = true;
        this.acceptFlowStepIndex = 1;
        this.fullWidthSteps = false;
    }

    onGetPreSelectedSecondPlan() {
        this._store.dispatch(setPlanCode({ planCode: 'Premier Streaming - Monthly|Promo - Premier Streaming - 12mo - 4.99/mo' }));
        this.showAcceptOfferFlow = true;
        this.acceptFlowStepIndex = 1;
        this.fullWidthSteps = false;
    }
    onContinueToNextFromInterstitial() {
        this._stepper.selectedIndex = this.enablePreSelectedPlan || this.enablePreSelectedSecondPlan ? CancelSteps.PRESELECTED_PLANS : CancelSteps.PRESENT_OFFERS;
    }

    onNavigateToGrid() {
        this._router.navigate([{ outlets: { modal: ['grid'] } }], { relativeTo: this._activatedRoute.parent });
    }

    onPackageSelected(packageName: string) {
        this.offersStepActive = false;
        this._store.dispatch(setSelectedPackageNameFromOfferGrid({ packageName }));
        this._gridSelectionComplete();
    }

    private _gridSelectionComplete() {
        this.showAcceptOfferFlow = true;
        this.acceptFlowStepIndex = 1;
        this.showHero = true;
    }

    private _getCancelReasons() {
        const random = Math.random();
        this.subjectLangChange$
            .pipe(withLatestFrom(this._store.pipe(select(getCurrentSubscriptionIsStreamingOnly))), takeUntil(this._destroy$))
            .subscribe(([, subscriptionIsStreaming]) => {
                const cancelReasons = this._translateService
                    .instant(`${this.translateKeyPrefix}CANCEL_REASONS`)
                    ?.filter((reason) => subscriptionIsStreaming || !reason['ONLY_STR']);
                const indexOther = cancelReasons.findIndex((reason) => reason['KEY'] === 'OTHER');
                const otherReason = cancelReasons.splice(indexOther, 1);
                cancelReasons?.sort(() => random - (1 - 0.1 * cancelReasons.length));
                cancelReasons.push(otherReason[0]);
                this.cancelReasons = cancelReasons;
                this.subscriptionIsStreaming = subscriptionIsStreaming;
            });
    }

    onDeactivatePlanGridModal() {
        this._store
            .select(getPlanIsSelectedFromGrid)
            .pipe(take(1))
            .subscribe((isSelected) => {
                if (isSelected) {
                    this.offersStepActive = false;
                    this._gridSelectionComplete();
                }
            });
    }
}
