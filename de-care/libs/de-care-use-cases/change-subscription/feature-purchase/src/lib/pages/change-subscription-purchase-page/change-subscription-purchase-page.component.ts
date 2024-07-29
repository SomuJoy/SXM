import { Component, ChangeDetectionStrategy, ViewChild, Inject, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
    setPlanCode,
    getSelectedOffer,
    yourCurrentPlan,
    setTermType,
    selectAccountData,
    setToUseCardOnFile,
    setToNotUseCardOnFile,
    clearPaymentInfo,
    setPaymentInfo,
    getTermSelectionInfo,
    getSelectedTermInfo,
    clearPlanCode,
    getCanSelectTerm,
    getCanSkipMultipackageSelectionStep,
    clearTermType,
    getTermType,
    getPlanCode,
    getAudioPackageChangeAllowed,
    LoadReviewOrderWorkflowService,
    getReviewOrderDataLoadIsProcessing,
    getOrderSummaryData,
    SubmitChangeSubscriptionWorkflowService,
    getSubmitChangeSubscriptionDataIsProcessing,
    PackageChangePlanRequiresConfirmationflowService,
    getPaymentInfoForInactiveStep,
    getPackageSelectionIsDowngrade,
    getPackageSelectionIsProcessing,
    initMultiPackageSelection,
    getAllCurrentPlans,
    getInfotainmentOffersAreAvailable,
    getInfotainmentPlansForForm,
    setInfotainmentPlanCodes,
    getInfotainmentOffersPackageNames,
    getChangeSubscriptionOffersError,
    getIsDataOnlyAndInfotainmentsAvailable,
    shouldPreSelectFirstPackage,
    getCurrentSubscriptionIsDataOnly,
    getCanContinueWithoutSelectAnyInfotainment,
    getShouldInfotainmentSelectionBeOptional,
    displayDefaultMultiPackageSelectionError,
    setCurrentAudioPackageAsSelectedPlanCode,
    getAllFollowOnPlansWithFullPrice,
    getMultiOfferSelectionData,
    resetMultiOfferSelectionForm,
    setMarketingPromoCode,
    clearMarketingPromoCode,
    LoadChangeSubscriptionPurchaseWorkflowService,
    getCurrentSubscriptionIsStreamingOnly,
    getHeroInfo,
    getShouldDisplayMarketingPromoCodeForm,
    getCurrentFollowOnPlansContainPromo,
    getPriceChangeViewModel,
} from '@de-care/de-care-use-cases/change-subscription/state-purchase';
import { CdkStepper } from '@angular/cdk/stepper';
import { TermType } from '@de-care/de-care-use-cases/change-subscription/ui-common';
import { TranslateService } from '@ngx-translate/core';
import { concatMap, filter, map, take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { DOCUMENT } from '@angular/common';
import { scrollToElementBySelector } from '@de-care/browser-common';
import { behaviorEventImpressionForComponent, behaviorEventImpressionForPage, behaviorEventInteractionEditClick } from '@de-care/shared/state-behavior-events';
import { getFeatureFlagEnableQuoteSummary } from '@de-care/shared/state-feature-flags';
import { SxmLanguages } from '@de-care/app-common';
import { getProvinceIsQuebec } from '@de-care/domains/customer/state-locale';
import { MarketingPromoCodeFormComponentApi } from '@de-care/domains/offers/ui-promo-code-validation-form';

interface PaymentInfoSubmission {
    paymentForm: {
        billingAddress: {
            addressLine1: string;
            city: string;
            state: string;
            zip: string;
        };
        ccExpDate: string;
        ccName: string;
        ccNum: string;
    };
    useCardOnFile: boolean;
}

@Component({
    selector: 'de-care-change-subscription-purchase-page',
    templateUrl: './change-subscription-purchase-page.component.html',
    styleUrls: ['./change-subscription-purchase-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeSubscriptionPurchasePageComponent implements OnInit, OnDestroy {
    @ViewChild('stepper') private _stepper: CdkStepper;
    @ViewChild('marketingPromoCodeForm') private readonly _marketingPromoCodeForm: MarketingPromoCodeFormComponentApi;
    translateKeyPrefix = 'deCareUseCasesChangeSubscriptionFeaturePurchaseModule.changeSubscriptionPurchasePageComponent';

    yourCurrentPlan$ = this._store.pipe(select(yourCurrentPlan));
    yourCurrentPlans$ = this._store.pipe(select(getAllCurrentPlans));
    followOnPlans$ = this._store.pipe(select(getAllFollowOnPlansWithFullPrice));

    getAudioPackageChangeAllowed$ = this._store.pipe(select(getAudioPackageChangeAllowed));
    selectedOffer$ = this._store.pipe(select(getSelectedOffer));
    shouldPreSelectFirstPackage$ = this._store.pipe(select(shouldPreSelectFirstPackage));
    canSkipMultipackageSelectionStep$ = this._store.pipe(select(getCanSkipMultipackageSelectionStep));
    planCode$ = this._store.pipe(select(getPlanCode));
    isDataOnlyAndInfotainmentsAvailable$ = this._store.pipe(select(getIsDataOnlyAndInfotainmentsAvailable));
    getCurrentSubscriptionIsDataOnly$ = this._store.pipe(select(getCurrentSubscriptionIsDataOnly));
    canSelectTerm$ = this._store.pipe(select(getCanSelectTerm));
    termSelectionInfo$ = this._store.pipe(select(getTermSelectionInfo));
    selectedTermInfo$ = this._store.pipe(select(getSelectedTermInfo));
    termType$ = this._store.pipe(select(getTermType));
    infotainmentOffersAreAvailable$ = this._store.pipe(select(getInfotainmentOffersAreAvailable));
    infotainmentPlansForForm$ = this._store.pipe(select(getInfotainmentPlansForForm));
    infotainmentPackageNames$ = this._store.pipe(select(getInfotainmentOffersPackageNames));
    selectAccount$ = this._store.pipe(select(selectAccountData));
    reviewOrderDataLoadIsProcessing$ = this._store.pipe(select(getReviewOrderDataLoadIsProcessing));
    submitChangeSubscriptionDataIsProcessing$ = this._store.pipe(select(getSubmitChangeSubscriptionDataIsProcessing));
    canContinueWithoutSelectAnyInfotainment$ = this._store.pipe(select(getCanContinueWithoutSelectAnyInfotainment));
    shouldInfotainmentSelectionBeOptional$ = this._store.pipe(select(getShouldInfotainmentSelectionBeOptional));
    orderSummaryData$ = this._store.pipe(select(getOrderSummaryData));
    selectedPackageIsDowngrade$ = this._store.pipe(select(getPackageSelectionIsDowngrade));
    closePackageChangeConfirmationModal$ = new BehaviorSubject<boolean>(true);
    paymentInfoInactiveStep$ = this._store.pipe(select(getPaymentInfoForInactiveStep));
    displayDefaultMultiPackageSelectionError$ = this._store.pipe(select(displayDefaultMultiPackageSelectionError));
    enableQuoteSummaryFeatureToggle$ = this._store.pipe(select(getFeatureFlagEnableQuoteSummary));
    changeSubscriptionOffersError$ = this._store.pipe(select(getChangeSubscriptionOffersError));
    displayInfotainmentSelectionError$ = new BehaviorSubject<boolean>(false);
    heroInfo$ = this._store.select(getHeroInfo);
    isQuebec$ = this._store.pipe(select(getProvinceIsQuebec));
    shouldDisplayMarketingPromoCodeForm$ = this._store.select(getShouldDisplayMarketingPromoCodeForm);
    showPriceIncrease$ = combineLatest([this.selectedOffer$, this.termType$]).pipe(map(([offer, term]) => offer?.priceChangeMessagingType && term === 'monthly'));
    priceChangeViewModel$ = this._store.select(getPriceChangeViewModel);
    multiOfferSelectionData$;
    resetMultiOfferSelectionForm$ = this._store.pipe(select(resetMultiOfferSelectionForm));
    currentFollowOnPlansContainPromo$ = this._store.select(getCurrentFollowOnPlansContainPromo);
    serviceError = false;
    readonly dateFormat$ = this._userSettingsService.dateFormat$;
    readonly locale = this._translateService.currentLang;

    private readonly _window: Window;
    private readonly oacUrl = this._settingsSrv.settings.oacUrl;
    private readonly destroy$ = new Subject<boolean>();
    isQuebec: boolean;
    mrfAmountInCA: number;

    constructor(
        private readonly _store: Store,
        private readonly _translateService: TranslateService,
        private readonly _router: Router,
        private readonly _submitChangeSubscriptionWorkflowService: SubmitChangeSubscriptionWorkflowService,
        private readonly _packageChangePlanRequiresConfirmationFlowService: PackageChangePlanRequiresConfirmationflowService,
        private readonly _loadChangeSubscriptionPurchaseWorkflowService: LoadChangeSubscriptionPurchaseWorkflowService,
        private readonly _loadReviewOrderWorkflowService: LoadReviewOrderWorkflowService,
        private readonly _settingsSrv: SettingsService,
        private readonly _userSettingsService: UserSettingsService,
        @Inject(DOCUMENT) private readonly _document: Document
    ) {
        this._window = this._document && this._document.defaultView;
        this.isQuebec = this._userSettingsService.isQuebec();
    }

    currentLang: SxmLanguages;
    isCurrentLangFrench: boolean;
    agreementAccepted = false;
    submitted = false;

    ngOnInit() {
        this._translateService.onLangChange
            .pipe(
                takeUntil(this.destroy$),
                map((lang) => lang.lang)
            )
            .subscribe((lang) => {
                this.currentLang = lang as SxmLanguages;
                this.isCurrentLangFrench = this.currentLang && this.currentLang === 'fr-CA';
            });

        this._store.pipe(select(getChangeSubscriptionOffersError), take(1)).subscribe((error) => {
            if (error) {
                this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHANGE_SUB', componentKey: error }));
            } else {
                this._store.dispatch(initMultiPackageSelection());
            }
        });

        this.multiOfferSelectionData$ = this._store.pipe(
            select(getMultiOfferSelectionData),
            map((packageData) => {
                const mainOffers = packageData.mainPackageData.map((packageData) => {
                    const fieldLabelTranslateKey = packageData.isCurrentSubscriptionDataOnly
                        ? '.PACKAGE_SELECTION_STEP.CONTENT_CARD_HEADLINE3'
                        : packageData.isSamePackage
                        ? '.PACKAGE_SELECTION_STEP.CONTENT_CARD_HEADLINE2'
                        : '.PACKAGE_SELECTION_STEP.CONTENT_CARD_HEADLINE1';
                    return {
                        fieldLabel: this._translateService.instant(`${this.translateKeyPrefix}${fieldLabelTranslateKey}`),
                        ariaLabel: this._translateService.instant(`${this.translateKeyPrefix}${fieldLabelTranslateKey}_ARIA`, { packageName: packageData?.data?.packageName }),
                        planCodeOptions: [{ planCode: packageData.planCode }],
                        packageData: packageData.data,
                    };
                });
                const additionalOffers = packageData.additionalPackageData.map((packageData) => {
                    const fieldLabelTranslateKey = packageData.isCurrentSubscriptionDataOnly
                        ? '.PACKAGE_SELECTION_STEP.CONTENT_CARD_HEADLINE3'
                        : packageData.isSamePackage
                        ? '.PACKAGE_SELECTION_STEP.CONTENT_CARD_HEADLINE2'
                        : '.PACKAGE_SELECTION_STEP.CONTENT_CARD_HEADLINE1';
                    return {
                        fieldLabel: this._translateService.instant(`${this.translateKeyPrefix}${fieldLabelTranslateKey}`),
                        ariaLabel: this._translateService.instant(`${this.translateKeyPrefix}${fieldLabelTranslateKey}_ARIA`, { packageName: packageData?.data?.packageName }),
                        planCodeOptions: [{ planCode: packageData.planCode }],
                        packageData: packageData.data,
                    };
                });
                return {
                    mainOffers,
                    additionalOffers,
                };
            })
        );
        this._store.pipe(select(getCurrentSubscriptionIsStreamingOnly), take(1)).subscribe((isStreaming) => {
            if (isStreaming) {
                this.mrfAmountInCA = 10.2;
            } else {
                this.mrfAmountInCA = 20.07;
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    onMultiOfferSelectionContinue(payload: { planCode: string }): void {
        if (payload.planCode) {
            this._store.dispatch(setPlanCode({ planCode: payload.planCode }));
            this._packageChangePlanRequiresConfirmationFlowService
                .build()
                .pipe(
                    concatMap((requiresConfirmation) =>
                        combineLatest([
                            of(requiresConfirmation),
                            this._store.pipe(select(getPackageSelectionIsDowngrade)),
                            this._store.pipe(select(getPackageSelectionIsProcessing)),
                        ])
                    ),
                    filter(([, , isProcessing]) => {
                        return !isProcessing;
                    }),
                    take(1)
                )
                .subscribe(([requiresConfirmation, isDowngrade]) => {
                    if (requiresConfirmation) {
                        if (isDowngrade) {
                            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:DowngradeWarning' }));
                        } else {
                            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:PromoWarning' }));
                        }
                        this.closePackageChangeConfirmationModal$.next(false);
                    } else {
                        this._moveToNextStepAndFixScroll();
                    }
                });
        } else {
            // continue without selection (allowContinueWithoutSelection is implied true since multi-offer-selection-form would never have fired empty emitter without it)
            this.onSelectCurrentPackage();
        }
    }

    onInfotainmentPackageSelected(selectedInfotainmentPlans: string[]): void {
        this._store.dispatch(setInfotainmentPlanCodes({ planCodes: selectedInfotainmentPlans }));
        this.canContinueWithoutSelectAnyInfotainment$.pipe(take(1)).subscribe((canContinueWithoutSelectAnyInfotainment) => {
            if (canContinueWithoutSelectAnyInfotainment) {
                this._moveToNextStepAndFixScroll();
            } else {
                this.displayInfotainmentSelectionError$.next(true);
                this._scrollToNoPackageSelectedError();
            }
        });
    }

    onClickedInfotainmentPlan() {
        this.displayInfotainmentSelectionError$.next(false);
    }

    onPackageSelectionModalAccepted(): void {
        this.closePackageChangeConfirmationModal$.next(true);
        this._moveToNextStepAndFixScroll();
    }

    onPackageSelectionModalKeepAllAccess(): void {
        this._store.dispatch(clearPlanCode());
        this.closePackageChangeConfirmationModal$.next(true);
        this._moveToNextStepAndFixScroll();
    }

    onPackageSelectionModalKeepMyPromo(): void {
        this._window.location.href = this.oacUrl;
    }

    handlePackageSelectionModalClosed(): void {
        this.closePackageChangeConfirmationModal$.next(true);
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'packageSelection' }));
    }

    onBillingPlanContinue(termType: TermType): void {
        this._store.dispatch(setTermType({ termType }));
        this._stepper.next();
    }

    onSelectPlanStepActive() {
        // this has to be a page impression since this is the first step in the flow so it needs to initialize the pageKey
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHANGE_SUB', componentKey: 'packageSelection' }));
    }

    onSelectInfotainmentOfferStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'dataPackageSelection' }));
    }

    onSelectTermStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'selectTermTypeForm' }));
    }

    onPaymentInfoActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentInfo' }));
    }

    onSkipToNextStep() {
        this._store.dispatch(clearPlanCode());
        this._stepper.next();
    }

    onSelectCurrentPackage() {
        this._store.dispatch(setCurrentAudioPackageAsSelectedPlanCode());
        this._stepper.next();
    }

    onEditPackageStep() {
        this._store.dispatch(clearTermType());
        this.displayInfotainmentSelectionError$.next(false);
    }

    onPaymentFormComplete(paymentInfoSubmission: PaymentInfoSubmission): void {
        if (paymentInfoSubmission.paymentForm) {
            this._store.dispatch(setPaymentInfo({ paymentInfo: paymentInfoSubmission.paymentForm }));
        } else {
            this._store.dispatch(clearPaymentInfo());
        }

        if (paymentInfoSubmission.useCardOnFile) {
            this._store.dispatch(setToUseCardOnFile());
        } else {
            this._store.dispatch(setToNotUseCardOnFile());
        }

        this._loadReviewOrderWorkflowService.build().subscribe(() => {
            this._stepper.next();
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'review' }));
        });
        this.serviceError = false;
    }

    onConfirmReviewAndSubmit(event): void {
        event.preventDefault();
        this.submitted = true;
        if (this.agreementAccepted) {
            this._submitChangeSubscriptionWorkflowService.build().subscribe(
                (data) => {
                    this._router.navigateByUrl('/subscription/change/thanks');
                },
                (error) => {
                    error === 'CREDIT_CARD_FAILURE' && this._handleUnexpectedCCError();
                }
            );
        }
    }

    onManageMyAccountButton() {
        this._window && (this._window.location.href = this.isCurrentLangFrench ? `${this.oacUrl}login_view.action?langpref=fr` : `${this.oacUrl}login_view.action`);
    }

    onMarketingPromoRedeemed(marketingPromoCode: string) {
        this._store.dispatch(setMarketingPromoCode({ marketingPromoCode }));
        this._loadChangeSubscriptionPurchaseWorkflowService.build({ changeTermOnly: false }).subscribe(
            () => {
                this._marketingPromoCodeForm.setProcessingCompleted();
            },
            (e) => {
                this._marketingPromoCodeForm.setProcessingError();
            }
        );
    }

    onMarketingPromoCodeRemoved() {
        this._store.dispatch(clearMarketingPromoCode());
        this._loadChangeSubscriptionPurchaseWorkflowService.build({ changeTermOnly: false }).subscribe();
    }

    private _handleUnexpectedCCError(): void {
        this.serviceError = true;
        this._stepper.previous();
        this._scrollToActiveStep();
    }

    private _moveToNextStepAndFixScroll() {
        this._stepper.next();
        this._scrollToActiveStep();
    }

    private _scrollToActiveStep() {
        scrollToElementBySelector('sxm-ui-accordion-stepper .active');
    }

    private _scrollToNoPackageSelectedError() {
        setTimeout(() => scrollToElementBySelector('.invalid-feedback.package-selected-error'));
    }
}
