import { Component, ViewChild, ChangeDetectionStrategy, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';
import { Store, select } from '@ngrx/store';
import {
    getBillingTermPlans,
    setPlanCode,
    getPlanCode,
    selectAccountData,
    getReviewOrderDataLoadIsProcessing,
    getPaymentInfoForInactiveStep,
    setPaymentInfo,
    clearPaymentInfo,
    setToUseCardOnFile,
    setToNotUseCardOnFile,
    getOrderSummaryData,
    LoadReviewOrderWorkflowService,
    SubmitChangeSubscriptionWorkflowService,
    getSubmitChangeSubscriptionDataIsProcessing,
    getSelectedTermInfo,
    getSelectedOffer,
    getSelectedOfferIsSelfPaid,
    getCurrentPlanTermLength,
    isPlusFeesNoteRequired,
    getPriceChangeViewModel,
} from '@de-care/de-care-use-cases/cancel-subscription/state-cancel-request';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { behaviorEventImpressionForComponent, behaviorEventInteractionEditClick } from '@de-care/shared/state-behavior-events';
import { getFeatureFlagEnableQuoteSummary } from '@de-care/shared/state-feature-flags';
import { BehaviorSubject } from 'rxjs';
import { ScrollService } from '@de-care/shared/browser-common/window-scroll';

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
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-accept-offer-flow',
    templateUrl: './accept-offer-flow.component.html',
    styleUrls: ['./accept-offer-flow.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptOfferFlowComponent implements AfterViewInit, ComponentWithLocale {
    @ViewChild('stepper') private _stepper: CdkStepper;
    @Input() currentPlan;
    @Input() isFlowActive = false;
    @Input() set stepIndex(index) {
        this._stepIndex = index;
        if (this._stepper) {
            this._stepper.selectedIndex = index;
            if (index === 1) {
                this.displayBillingTerms ? this.dispatchBillingTermImpression() : this.dispatchPaymentInfoImpression();
            }
        }
    }
    _stepIndex = 0;
    @Input() displayBillingTerms = false;
    @Input() warningMessage: string;
    @Output() editPackageStep = new EventEmitter();
    languageResources: LanguageResources;
    translateKeyPrefix: string;

    selectedOffer$ = this._store.pipe(select(getSelectedOffer));
    billingTermPlans$ = this._store.pipe(select(getBillingTermPlans));
    priceChangeViewModel$ = this._store.pipe(select(getPriceChangeViewModel));
    planCode$ = this._store.pipe(select(getPlanCode));
    enableQuoteSummaryFeatureToggle$ = this._store.pipe(select(getFeatureFlagEnableQuoteSummary));
    selectedOfferIsSelfPaid$ = this._store.pipe(select(getSelectedOfferIsSelfPaid));
    currentPlanTermLength$ = this._store.pipe(select(getCurrentPlanTermLength));
    plusFeesNoteRequired$ = this._store.pipe(select(isPlusFeesNoteRequired));
    ccError$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    serviceError$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    selectedTermInfo$ = this._store.pipe(
        select(getSelectedTermInfo),
        map((selectedTermInfo) => {
            let translateKey;
            if (selectedTermInfo.isMonthly) {
                translateKey =
                    selectedTermInfo.termLength === 1 ? `${this.translateKeyPrefix}.SELECTED_TERM_MONTH_TO_MONTH` : `${this.translateKeyPrefix}.SELECTED_TERM_MONTHLY`;
            } else {
                switch (selectedTermInfo.termLength) {
                    case 1: {
                        translateKey = `${this.translateKeyPrefix}.SELECTED_TERM_MONTHLY`;
                        break;
                    }
                    case 6: {
                        translateKey = `${this.translateKeyPrefix}.SELECTED_TERM_SEMI_ANNUAL`;
                        break;
                    }
                    case 12: {
                        translateKey = `${this.translateKeyPrefix}.SELECTED_TERM_ANNUAL`;
                        break;
                    }
                    default: {
                        translateKey = `${this.translateKeyPrefix}.SELECTED_TERM_OTHER`;
                    }
                }
            }
            return { ...selectedTermInfo, translateKey };
        })
    );

    selectAccount$ = this._store.pipe(select(selectAccountData));
    reviewOrderDataLoadIsProcessing$ = this._store.pipe(select(getReviewOrderDataLoadIsProcessing));
    paymentInfoInactiveStep$ = this._store.pipe(select(getPaymentInfoForInactiveStep));

    orderSummaryData$ = this._store.pipe(select(getOrderSummaryData));
    submitChangeSubscriptionDataIsProcessing$ = this._store.pipe(select(getSubmitChangeSubscriptionDataIsProcessing));

    submitted = false;
    agreementAccepted = false;

    constructor(
        private readonly _store: Store,
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _loadReviewOrderWorkflowService: LoadReviewOrderWorkflowService,
        private readonly _submitChangeSubscriptionWorkflowService: SubmitChangeSubscriptionWorkflowService,
        private readonly _router: Router,
        private readonly _scrollService: ScrollService
    ) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit(): void {
        this._stepper.selectedIndex = this._stepIndex;
        if (this._stepper) {
            this._stepper.selectedIndex = this._stepIndex;
        }
    }

    onEditPackageStep(): void {
        this._store.dispatch(behaviorEventInteractionEditClick({ componentNametoEdit: 'offers' }));
        this.editPackageStep.emit();
    }

    onEditBillingTermStep(): void {
        this._store.dispatch(behaviorEventInteractionEditClick({ componentNametoEdit: 'selectTermTypeForm' }));
        this.dispatchBillingTermImpression();
    }

    onEditPaymentInfoStep(): void {
        this._store.dispatch(behaviorEventInteractionEditClick({ componentNametoEdit: 'paymentInfo' }));
        this.dispatchPaymentInfoImpression();
    }

    dispatchBillingTermImpression() {
        if (this.isFlowActive) {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'acceptOfferBillingTerms' }));
        }
    }

    dispatchPaymentInfoImpression() {
        if (this.isFlowActive) {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'acceptOfferPaymentInfo' }));
        }
    }

    onReviewStepActive() {
        if (this.isFlowActive) {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'acceptOfferReview' }));
        }
    }

    onBillingTermSelected(planCode): void {
        if (planCode) {
            this._store.dispatch(setPlanCode({ planCode }));
            this.dispatchPaymentInfoImpression();
            this._moveToNextStepAndFixScroll();
        }
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
            this._moveToNextStepAndFixScroll();
        });
    }

    onConfirmReviewAndSubmit(event): void {
        event.preventDefault();
        this.ccError$.next(false);
        this.submitted = true;
        if (this.agreementAccepted) {
            this._submitChangeSubscriptionWorkflowService.build().subscribe({
                next: () => {
                    this._router.navigate(['/subscription/cancel/thanks']);
                },
                error: (err) => {
                    err === 'CREDIT_CARD_FAILURE' ? this.ccError$.next(true) : this.serviceError$.next(true);
                    this._stepper.previous();
                    this._scrollToActiveStep();
                },
            });
        }
    }

    private _moveToNextStepAndFixScroll() {
        this._stepper.next();
        this._scrollToActiveStep();
    }

    private _scrollToActiveStep() {
        this._scrollService.scrollToElementBySelector('sxm-ui-accordion-stepper .active');
    }
}
