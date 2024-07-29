import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import {
    captureUserSelectedPlanCode,
    collectPaymentInfo,
    getAccountInfoViewModel,
    getChangeSelectedOfferIsAllowed,
    getChangeSelectedOfferViewModel,
    getDisplayNuCaptcha,
    getOfferPricingInfoForChangeSelectedMappedByPlanCode,
    getPaymentMethodOptionsViewModel,
    getQuoteViewModel,
    getSelectedOfferViewModel,
    getSelectedPaymentMethodSummaryViewModel,
    LoadPurchaseReviewDataWorkflowService,
    SubmitPurchaseTransactionWorkflowErrors,
    SubmitPurchaseTransactionWorkflowService,
    LoadAccountAndCheckDeviceOfferForDeviceWorkflowService,
    getRadioInfoForSelectedDeviceViewModel,
    getDeviceLookupViewModel,
} from '@de-care/de-care-use-cases/checkout/state-satellite';
import { SxmUiAccordionStepperComponent } from '@de-care/shared/sxm-ui/ui-accordion-stepper';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OfferGridFormComponentApi } from '@de-care/shared/sxm-ui/ui-offer-grid';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import {
    PaymentInfoData,
    PaymentInfoFormComponent,
    PaymentInfoFormComponentApi,
    ReviewQuoteAndApproveFormComponent,
    ReviewQuoteAndApproveFormComponentApi,
} from '@de-care/de-care-use-cases/checkout/ui-common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'purchase-organic-page',
    templateUrl: './purchase-organic-page.component.html',
    styleUrls: ['./purchase-organic-page.component.scss'],
})
export class PurchaseOrganicPageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureSatelliteModule.PurchaseOrganicPageComponent.';
    private readonly _offerViewModel$ = this._store.select(getSelectedOfferViewModel);
    private readonly _accountInfoViewModel$ = this._store.select(getAccountInfoViewModel).pipe(filter((accountInfo) => !!accountInfo));
    heroViewModel$ = this._offerViewModel$.pipe(map(({ hero }) => hero));
    primaryPackageCardViewModel$ = this._offerViewModel$.pipe(map(({ offerDescription }) => offerDescription));
    selectedDeviceSubscriptionViewModel$ = this._store.select(getRadioInfoForSelectedDeviceViewModel);
    selectedPlanSummary$ = this._offerViewModel$.pipe(
        map(({ offerDescription, termLength, retailPrice, totalPrice }) => ({ offerDescription, termLength, retailPrice, totalPrice }))
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
    displayIneligibleLoader$ = new BehaviorSubject(false);
    quoteViewModel$ = this._store.select(getQuoteViewModel);
    displayNuCaptcha$ = this._store.select(getDisplayNuCaptcha);
    deviceLookupViewModel$ = this._store.select(getDeviceLookupViewModel);
    @ViewChild('offerGridForm') private readonly _offerGridForm: OfferGridFormComponentApi;
    @ViewChild('stepper') private readonly _stepper: SxmUiAccordionStepperComponent;
    @ViewChild('offerSelectionModal') private readonly _offerSelectionModal: SxmUiModalComponent;
    @ViewChild(PaymentInfoFormComponent) private readonly _paymentInfoFormComponent: PaymentInfoFormComponentApi;
    @ViewChild(ReviewQuoteAndApproveFormComponent) private readonly _reviewQuoteAndApproveFormComponent: ReviewQuoteAndApproveFormComponentApi;
    showFullViewLoader$ = new BehaviorSubject(false);

    constructor(
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _translateService: TranslateService,
        private readonly _loadAccountAndCheckDeviceOfferForDeviceWorkflowService: LoadAccountAndCheckDeviceOfferForDeviceWorkflowService,
        private readonly _loadPurchaseReviewDataWorkflowService: LoadPurchaseReviewDataWorkflowService,
        private readonly _submitPurchaseTransactionWorkflowService: SubmitPurchaseTransactionWorkflowService
    ) {}

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
    }

    onDeviceSelectionStarted() {
        this.showFullViewLoader$.next(true);
    }

    onDeviceSelection({ selectedAccountNumber, selectedRadio }) {
        this._loadAccountAndCheckDeviceOfferForDeviceWorkflowService
            .build({ accountNumber: selectedAccountNumber, radioId: selectedRadio?.last4DigitsOfRadioId })
            .subscribe(() => {
                this.showFullViewLoader$.next(false);
                this._stepper.next();
            });
    }

    onBillingInformationStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentInfo' }));
    }

    onReviewStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'review' }));
    }

    onEditBillingInformationClick() {
        this._stepper.selectedIndex = 0;
    }

    openOfferGrid() {
        this._offerGridForm.reset();
        this._offerSelectionModal.open();
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'offergrid' }));
    }

    submitTransaction() {
        this._paymentInfoFormComponent.clearCreditCardSubmissionError();
        this._submitPurchaseTransactionWorkflowService.build().subscribe({
            next: () => {
                this._router.navigate(['thanks'], { relativeTo: this._activatedRoute, replaceUrl: true }).then(() => {
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

    onOfferGridClosed() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentInfo' }));
    }

    setSelectedPlanCode(planCode: string) {
        this._store.dispatch(captureUserSelectedPlanCode({ planCode }));
        this._offerSelectionModal.close();
    }

    private goToNextStepAndScrollIntoView() {
        this._stepper.next();
        // TODO: add scroll logic
    }
}
