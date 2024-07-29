import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent, behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { map, startWith } from 'rxjs/operators';
import {
    collectPaymentInfo,
    collectSelectedPlanCode,
    getAllPlans,
    getDisplayNuCaptcha,
    getPaymentMethodOptionsViewModel,
    getQuoteViewModel,
    getRadioAndCurentPlanInfoForSelectedDeviceViewModel,
    getSelectedOfferViewModel,
    getSelectedPaymentMethodSummaryViewModel,
    getSelectedPlan,
    getSelectedPlanDealType,
    getSelectedPlanPackageName,
    getSelectedPlanTermLength,
    LoadReviewDataWorkflowService,
    SubmitFullPriceUpgradeTransactionWorkflowService,
    SubmitFullPriceUpgradeTransactionWorkflowServiceError,
} from '@de-care/de-care-use-cases/checkout/state-upgrade';
import { CdkStepper } from '@angular/cdk/stepper';
import { TranslateService } from '@ngx-translate/core';
import {
    PaymentInfoData,
    PaymentInfoFormComponent,
    PaymentInfoFormComponentApi,
    ReviewQuoteAndApproveFormComponent,
    ReviewQuoteAndApproveFormComponentApi,
} from '@de-care/de-care-use-cases/checkout/ui-common';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'de-care-full-price-purchase-page',
    templateUrl: './full-price-purchase-page.component.html',
    styleUrls: ['./full-price-purchase-page.component.scss'],
})
export class FullPricePurchasePageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeModule.FullPricePurchasePageComponent.';

    constructor(
        private readonly _store: Store,
        private readonly _translateService: TranslateService,
        private readonly _router: Router,
        private readonly _loadReviewDataWorkflowService: LoadReviewDataWorkflowService,
        private readonly _submitFullPriceUpgradeTransactionWorkflowService: SubmitFullPriceUpgradeTransactionWorkflowService,
        private readonly _activatedRoute: ActivatedRoute
    ) {}

    private readonly _offerViewModel$ = this._store.select(getSelectedOfferViewModel);
    heroViewModel$ = this._offerViewModel$.pipe(map(({ hero }) => hero));
    legalCopyViewModel$ = this._offerViewModel$.pipe(map(({ legalCopy }) => legalCopy));
    dealAddonCopy$ = this._offerViewModel$.pipe(map(({ dealCopy }) => dealCopy));
    selectedDeviceSubscriptionViewModel$ = this._store.select(getRadioAndCurentPlanInfoForSelectedDeviceViewModel);
    offerDescriptionCopy$ = this._offerViewModel$.pipe(map(({ offerDescriptionCopy }) => offerDescriptionCopy));
    plans$ = this._store.select(getAllPlans);
    selectedPlan$ = this._store.select(getSelectedPlan);
    selectedPlanPackageName$ = this._store.select(getSelectedPlanPackageName);
    selectedPlanTermLength$ = this._store.select(getSelectedPlanTermLength);
    selectedPlanDealType$ = this._store.select(getSelectedPlanDealType);
    currentLang$ = this._translateService.onLangChange.pipe(
        startWith({ lang: this._translateService.currentLang }),
        map(({ lang }) => lang)
    );
    includePlusFees: boolean;
    paymentMethodOptionsViewModel$ = this._store.select(getPaymentMethodOptionsViewModel);
    selectedPaymentMethodSummaryViewModel$ = this._store.select(getSelectedPaymentMethodSummaryViewModel);
    quoteViewModel$ = this._store.select(getQuoteViewModel);
    displayNuCaptcha$ = this._store.pipe(select(getDisplayNuCaptcha));

    @ViewChild('stepper') private _stepper: CdkStepper;
    @ViewChild(PaymentInfoFormComponent) private readonly _paymentInfoFormComponent: PaymentInfoFormComponentApi;
    @ViewChild(ReviewQuoteAndApproveFormComponent) private readonly _reviewQuoteAndApproveFormComponent: ReviewQuoteAndApproveFormComponentApi;

    chevronClickTrackingText = 'Explore More';

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'PlanInfo' }));
    }

    onUpgradedPlanInformationStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'UpgradedPlanInfo' }));
    }

    onPickYourBillingPlanStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'PickYourBillingPlan' }));
    }

    onEnterYourPaymentInfoStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Payment' }));
    }

    onReviewStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Review' }));
    }

    onUpgradedPlanInformationClick() {
        this._stepper.selectedIndex = 0;
    }

    onPickYourBillingPlanClick() {
        this._stepper.selectedIndex = 1;
    }

    onEnterYourPaymentInfoClick() {
        this._stepper.selectedIndex = 2;
    }

    submitUpgradedPlanInfo() {
        this._moveToNextStepAndFixScroll();
    }

    onSelectedPlan(selectedPlanCode: string) {
        this._store.dispatch(collectSelectedPlanCode({ planCode: selectedPlanCode }));
        this._moveToNextStepAndFixScroll();
    }
    onPaymentInfoCollected(paymentInfoData: PaymentInfoData) {
        this._store.dispatch(collectPaymentInfo(paymentInfoData));
        this._loadReviewDataWorkflowService.build().subscribe({
            next: () => {
                this._moveToNextStepAndFixScroll();
                this._paymentInfoFormComponent.setProcessingCompleted();
            },
            error: () => {
                // TODO: show system error message
                this._paymentInfoFormComponent.setProcessingCompleted();
            },
        });
    }

    private _moveToNextStepAndFixScroll() {
        this._stepper.next();
    }

    submitTransaction() {
        this._paymentInfoFormComponent.clearCreditCardSubmissionError();
        this._submitFullPriceUpgradeTransactionWorkflowService.build().subscribe({
            next: () => {
                this._router.navigate(['thanks'], { relativeTo: this._activatedRoute, replaceUrl: true }).then(() => {
                    this._reviewQuoteAndApproveFormComponent.setProcessingCompleted();
                });
            },
            error: (error: SubmitFullPriceUpgradeTransactionWorkflowServiceError) => {
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
}
