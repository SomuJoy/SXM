import { AfterViewInit, Component, HostBinding, Inject, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent, behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import {
    captureUserSelectedPlanCode,
    collectPaymentInfo,
    getAccountInfoViewModel,
    getChangeSelectedOfferIsAllowed,
    getChangeSelectedOfferViewModel,
    getDisplayNuCaptcha,
    getOfferIncludesFees,
    getOfferPricingInfoForChangeSelectedMappedByPlanCode,
    getPaymentMethodOptionsViewModel,
    getPlanRecapCardViewModel,
    getQuebecProvince,
    getQuoteViewModel,
    getSelectedOfferViewModel,
    getSelectedPaymentMethodSummaryViewModel,
    getUpsellOffersViewModel,
    LoadPurchaseReviewDataWorkflowService,
    SubmitPurchaseTransactionWorkflowErrors,
    SubmitPurchaseTransactionWorkflowService,
} from '@de-care/de-care-use-cases/checkout/state-satellite';
import { filter, map } from 'rxjs/operators';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { SxmUiAccordionStepperComponent } from '@de-care/shared/sxm-ui/ui-accordion-stepper';
import { SxmUiNucaptchaComponent } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import {
    PaymentInfoData,
    PaymentInfoFormComponent,
    PaymentInfoFormComponentApi,
    ReviewQuoteAndApproveFormComponent,
    ReviewQuoteAndApproveFormComponentApi,
} from '@de-care/de-care-use-cases/checkout/ui-common';
import { OfferGridFormComponentApi } from '@de-care/shared/sxm-ui/ui-offer-grid';

@Component({
    selector: 'purchase-targeted-page',
    templateUrl: './purchase-targeted-page.component.html',
    styleUrls: ['./purchase-targeted-page.component.scss'],
})
export class PurchaseTargetedPageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureSatelliteModule.PurchaseTargetedPageComponent.';
    private readonly _offerViewModel$ = this._store.select(getSelectedOfferViewModel);
    private readonly _upsellOffersViewModel$ = this._store.select(getUpsellOffersViewModel);
    hasUpsellOffers$ = this._upsellOffersViewModel$.pipe(filter((UpsellPackageModel) => !!UpsellPackageModel[0]));
    private readonly _accountInfoViewModel$ = this._store.select(getAccountInfoViewModel).pipe(filter((accountInfo) => !!accountInfo));
    heroViewModel$ = this._offerViewModel$.pipe(map(({ hero }) => (!this._activatedRoute.snapshot.data?.hideHero ? hero : null)));
    primaryPackageCardViewModel$ = this._offerViewModel$.pipe(
        map(({ offerDescription }) => (!this._activatedRoute.snapshot.data?.hideOfferPresentment ? offerDescription : null))
    );
    planRecapCardViewModel$ = this._store.select(getPlanRecapCardViewModel);
    offerIncludesFees$ = this._store.select(getOfferIncludesFees);
    // TODO: this should be changed to what it is doing for the UI and not isQuebec
    isQuebecProvince$ = this._store.select(getQuebecProvince);
    selectedPlanSummary$ = this._offerViewModel$.pipe(
        map(({ offerDescription, termLength, retailPrice, totalPrice }) =>
            !this._activatedRoute.snapshot.data?.hideSelectedPlanSummary ? { offerDescription, termLength, retailPrice, totalPrice } : null
        )
    );
    radioInfoViewModel$ = this._accountInfoViewModel$.pipe(map(({ vehicleInfo, radioIdLastFour }) => ({ vehicleInfo, radioIdLastFour })));
    legalCopy$ = this._offerViewModel$.pipe(map(({ legalCopy }) => legalCopy));
    accountSummary$ = this._accountInfoViewModel$.pipe(map(({ accountIsTrial, currentPlanEndDate, termLength }) => ({ accountIsTrial, currentPlanEndDate, termLength })));
    currentLang$ = this._translateService.onLangChange.pipe(map((ev) => ev.lang));
    changeSelectedOfferLinkAvailable$ = this._store.select(getChangeSelectedOfferIsAllowed);
    changeSelectedOfferViewModel$ = combineLatest([
        this._store.select(getChangeSelectedOfferViewModel),
        this._store.select(getOfferPricingInfoForChangeSelectedMappedByPlanCode),
        this._translateService.stream(this.translateKeyPrefix),
    ]).pipe(
        map(([offersViewModels, offersPricing]) =>
            offersViewModels.map((offerViewModel) => {
                const { price, termLength, retailPrice, isInTrial } = offersPricing[offerViewModel.planCode];
                return {
                    ...offerViewModel,
                    calloutText: isInTrial ? this._translateService.instant(`${this.translateKeyPrefix}PLAN_GRID.IN_TRIAL`) : '',
                    priceText: this._translateService.instant(`${this.translateKeyPrefix}PLAN_GRID.MONTHLY_PRICE`, { price, termLength, retailPrice }),
                };
            })
        )
    );
    paymentMethodOptionsViewModel$ = this._store.select(getPaymentMethodOptionsViewModel);
    selectedPaymentMethodSummaryViewModel$ = this._store.select(getSelectedPaymentMethodSummaryViewModel);
    @ViewChild('offerGridForm') private readonly _offerGridForm: OfferGridFormComponentApi;
    @ViewChild('stepper') private readonly _stepper: SxmUiAccordionStepperComponent;
    @ViewChild('offerSelectionModal') private readonly _offerSelectionModal: SxmUiModalComponent;
    @ViewChild(PaymentInfoFormComponent) private readonly _paymentInfoFormComponent: PaymentInfoFormComponentApi;
    displayIneligibleLoader$ = new BehaviorSubject(false);
    quoteViewModel$ = this._store.select(getQuoteViewModel);

    @ViewChild(ReviewQuoteAndApproveFormComponent) private readonly _reviewQuoteAndApproveFormComponent: ReviewQuoteAndApproveFormComponentApi;
    @ViewChild('nuCaptchaComponent') private readonly _nuCaptchaComponent: SxmUiNucaptchaComponent;
    displayNuCaptcha$ = this._store.select(getDisplayNuCaptcha);
    @HostBinding('class.no-offer-presentment') noHeroClass = this._activatedRoute.snapshot.data?.hideOfferPresentment;

    constructor(
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _loadPurchaseReviewDataWorkflowService: LoadPurchaseReviewDataWorkflowService,
        private readonly _submitPurchaseTransactionWorkflowService: SubmitPurchaseTransactionWorkflowService,
        private readonly _sxmValidators: SxmValidators,
        private readonly _translateService: TranslateService,
        @Inject(DOCUMENT) private readonly _document: Document
    ) {}

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'paymentInfo' }));
    }

    openOfferGrid() {
        this._offerGridForm.reset();
        this._offerSelectionModal.open();
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'offergrid' }));
    }

    onOfferGridClosed() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentInfo' }));
    }

    setSelectedPlanCode(planCode: string) {
        this._store.dispatch(captureUserSelectedPlanCode({ planCode }));
        this._offerSelectionModal.close();
    }

    private _scrollToTop() {
        this._document.body.scrollTop = 0;
    }

    private goToNextStepAndScrollIntoView() {
        this._stepper.next();
        // TODO: add scroll logic
    }

    onEditBillingInformationClick() {
        this._stepper.selectedIndex = 0;
    }

    onBillingInformationStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentInfo' }));
    }

    onEditUpsellClick() {
        this._stepper.selectedIndex = 1;
    }

    onUpsellStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'upsell' }));
    }

    onUpsellContinue() {
        this.goToNextStepAndScrollIntoView();
    }

    onReviewStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'review' }));
    }

    submitTransaction() {
        this._paymentInfoFormComponent.clearCreditCardSubmissionError();
        this._submitPurchaseTransactionWorkflowService.build().subscribe({
            next: () => {
                this._router.navigate([this._activatedRoute.snapshot.data.routeUrlNext || 'thanks'], { relativeTo: this._activatedRoute, replaceUrl: true }).then(() => {
                    this._reviewQuoteAndApproveFormComponent.setProcessingCompleted();
                });
            },
            error: (error: SubmitPurchaseTransactionWorkflowErrors) => {
                this._reviewQuoteAndApproveFormComponent.setProcessingCompleted();
                switch (error) {
                    case 'CREDIT_CARD_FAILURE': {
                        this._paymentInfoFormComponent.showCreditCardSubmissionError();
                        this._stepper.previous();
                        // TODO: scroll step into view
                        break;
                    }
                    default: {
                        // TODO: add error handling for general processing issue (and possibly password issue?)
                        break;
                    }
                }
            },
        });
    }

    onPaymentInfoCollected({ useCardOnFile, paymentInfo }: PaymentInfoData) {
        this._store.dispatch(collectPaymentInfo({ useCardOnFile, paymentInfo }));
        this._loadPurchaseReviewDataWorkflowService.build().subscribe({
            next: () => {
                this.goToNextStepAndScrollIntoView();
                this.displayIneligibleLoader$.next(false);
                this._paymentInfoFormComponent.setProcessingCompleted();
            },
            error: () => {
                // TODO: show system error message
                this.displayIneligibleLoader$.next(false);
                this._paymentInfoFormComponent.setProcessingCompleted();
            },
        });
    }
}
