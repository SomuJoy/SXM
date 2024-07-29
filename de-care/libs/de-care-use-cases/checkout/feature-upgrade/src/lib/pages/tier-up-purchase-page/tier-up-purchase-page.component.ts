import { CdkStepper } from '@angular/cdk/stepper';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    collectPaymentInfo,
    getDisplayNuCaptcha,
    getPaymentMethodOptionsViewModel,
    getQuoteViewModel,
    getRadioInfoForSelectedDeviceViewModel,
    getSelectedOfferDetailsCopyModel,
    getSelectedOfferViewModel,
    getSelectedPaymentMethodSummaryViewModel,
    getShouldIncludePlusFees,
    getUpgradeSummaryViewModel,
    LoadReviewDataWorkflowService,
    SubmitTierUpTransactionWorkflowService,
    SubmitTierUpTransactionWorkflowServiceError,
    setCurrentLocale,
} from '@de-care/de-care-use-cases/checkout/state-upgrade';
import {
    PaymentInfoData,
    PaymentInfoFormComponent,
    PaymentInfoFormComponentApi,
    ReviewQuoteAndApproveFormComponent,
    ReviewQuoteAndApproveFormComponentApi,
} from '@de-care/de-care-use-cases/checkout/ui-common';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';
import { filter, map, startWith, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'de-care-tier-up-purchase-page',
    templateUrl: './tier-up-purchase-page.component.html',
    styleUrls: ['./tier-up-purchase-page.component.scss'],
})
export class TierUpPurchasePageComponent {
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeModule.TierUpPurchasePageComponent.';
    private readonly _offerViewModel$ = this._store.select(getSelectedOfferViewModel);
    heroViewModel$ = this._offerViewModel$.pipe(map(({ hero }) => hero));
    legalCopyViewModel$ = this._store.select(getSelectedOfferDetailsCopyModel);
    selectedDeviceSubscriptionViewModel$ = this._store.select(getRadioInfoForSelectedDeviceViewModel);
    isAnnual$ = this._store.select(getRadioInfoForSelectedDeviceViewModel).pipe(
        filter((info) => !!info[0]),
        map((info) => {
            return info?.[0]?.isAnnual;
        })
    );
    upgradeSummaryViewModel$ = this._store.select(getUpgradeSummaryViewModel);
    paymentMethodOptionsViewModel$ = this._store.select(getPaymentMethodOptionsViewModel);
    selectedPaymentMethodSummaryViewModel$ = this._store.select(getSelectedPaymentMethodSummaryViewModel);
    quoteViewModel$ = this._store.select(getQuoteViewModel);
    displayNuCaptcha$ = this._store.pipe(select(getDisplayNuCaptcha));
    currentLang$ = this._translateService.onLangChange.pipe(
        startWith({ lang: this._translateService.currentLang }),
        map(({ lang }) => lang),
        tap((lang) => this._store.dispatch(setCurrentLocale({ locale: lang })))
    );
    includePlusFees$ = this._store.pipe(select(getShouldIncludePlusFees));

    @ViewChild('stepper') private _stepper: CdkStepper;
    @ViewChild(PaymentInfoFormComponent) private readonly _paymentInfoFormComponent: PaymentInfoFormComponentApi;
    @ViewChild(ReviewQuoteAndApproveFormComponent) private readonly _reviewQuoteAndApproveFormComponent: ReviewQuoteAndApproveFormComponentApi;

    constructor(
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _loadReviewDataWorkflowService: LoadReviewDataWorkflowService,
        private readonly _submitTierUpTransactionWorkflowService: SubmitTierUpTransactionWorkflowService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _translateService: TranslateService,
        @Inject(DOCUMENT) private readonly _document: Document
    ) {}

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

    onBillingInformationStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentInfo' }));
    }

    onEditBillingInformationClick() {
        this._stepper.selectedIndex = 0;
    }

    onReviewStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Review' }));
    }

    submitTransaction() {
        this._paymentInfoFormComponent.clearCreditCardSubmissionError();
        this._submitTierUpTransactionWorkflowService.build().subscribe({
            next: () => {
                this._router.navigate(['thanks'], { relativeTo: this._activatedRoute, replaceUrl: true }).then(() => {
                    this._reviewQuoteAndApproveFormComponent.setProcessingCompleted();
                });
            },
            error: (error: SubmitTierUpTransactionWorkflowServiceError) => {
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

    private _moveToNextStepAndFixScroll() {
        this._stepper.next();
    }
}
