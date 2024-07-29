import { AfterViewInit, Component, ViewChild, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CdkStepper } from '@angular/cdk/stepper';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import {
    LoadQuotesForReviewWorkflowService,
    setPaymentMethodAsCardOnFile,
    setPaymentMethodAsNotCardOnFile,
    setPaymentInfo,
    clearPaymentInfo,
    setPaymentTypeAsInvoice,
    setPaymentTypeAsCreditCard,
    getShowOffers,
    getIsModeServiceContinuity,
    getDefaultMode,
    DefaultMode,
    getIsLoggedIn,
    getDisplayPriceChangeMessage,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { scrollToElementBySelector } from '@de-care/browser-common';
import { Router } from '@angular/router';
import { withLatestFrom, takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { behaviorEventImpressionForPage, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';

interface PaymentInfo {
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
    useInvoice: boolean;
}

@Component({
    selector: 'de-care-add-radio-page',
    templateUrl: './add-radio-page.component.html',
    styleUrls: ['./add-radio-page.component.scss'],
})
export class AddRadioPageComponent implements AfterViewInit, OnDestroy {
    @ViewChild('stepper') private readonly _stepper: CdkStepper;
    @ViewChild('subStepper') private readonly _subStepper: CdkStepper;
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.AddRadioPageComponent.';
    showPaymentBackButton = true;
    isFirstImpression = true;
    isLoggedIn$ = this._store.pipe(select(getIsLoggedIn));
    displayPriceChangeMessage$ = this._store.pipe(select(getDisplayPriceChangeMessage));
    private unsubscribe$: Subject<void> = new Subject();
    ccError = false;

    constructor(private readonly _store: Store, private readonly _router: Router, private readonly _loadQuotesForReviewWorkflowService: LoadQuotesForReviewWorkflowService) {}

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.pipe(select(getDefaultMode), take(1)).subscribe((mode) => {
            this._store.dispatch(behaviorEventImpressionForPage({ pageKey: this._getAnalyticsPayKeyFromMode(mode), componentKey: 'radioFound' }));
        });
        this.isFirstImpression = false;
        this._store
            .pipe(select(getShowOffers), takeUntil(this.unsubscribe$), withLatestFrom(this._store.pipe(select(getIsModeServiceContinuity))))
            .subscribe(([showOffers, isModeSC]) => {
                this.showPaymentBackButton = isModeSC || showOffers;
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    goBackToSelectTransferMethod() {
        this.previousAndScrollUp();
    }

    onPaymentFormComplete(paymentInfo: PaymentInfo) {
        if (paymentInfo.paymentForm?.ccNum) {
            this._store.dispatch(setPaymentInfo({ paymentInfo: paymentInfo.paymentForm }));
            this._store.dispatch(setPaymentTypeAsCreditCard());
        } else {
            this._store.dispatch(clearPaymentInfo());
        }

        if (paymentInfo.useCardOnFile) {
            this._store.dispatch(setPaymentMethodAsCardOnFile());
            this._store.dispatch(setPaymentTypeAsCreditCard());
        } else {
            this._store.dispatch(setPaymentMethodAsNotCardOnFile());
        }

        if (paymentInfo.useInvoice) {
            this._store.dispatch(setPaymentTypeAsInvoice());
        }

        this._loadQuotesForReviewWorkflowService.build().subscribe(() => {
            this.nextAndScrollUp();
        });
    }

    onSubmitTransactionComplete() {
        this._router.navigate(['/transfer/radio/thanks']);
    }

    onSubmitTransactionCompleteWithCCError() {
        this._stepper.previous();
        this.ccError = true;
    }

    nextAndScrollUp() {
        this._stepper.next();
        scrollToElementBySelector('[data-scroll="scroll-top"]');
    }

    previousAndScrollUp() {
        this._stepper.previous();
        scrollToElementBySelector('[data-scroll="scroll-top"]');
    }

    subStepperNextAndScrollUp() {
        this._subStepper.next();
        scrollToElementBySelector('[data-scroll="scroll-top"]');
    }

    subStepperPreviousAndScrollUp() {
        this._subStepper.previous();
        scrollToElementBySelector('[data-scroll="scroll-top"]');
    }
    onFirstStepActive() {
        if (!this.isFirstImpression) {
            if (this._subStepper.selectedIndex === 0) {
                this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'subscription' }));
            } else if (this._subStepper.selectedIndex === 1) {
                this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'package' }));
            }
        }
    }
    onSelectTransferMethodStepActive() {
        if (!this.isFirstImpression) {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'subscription' }));
        }
    }
    onChooseSubscriptionStepActive() {
        if (!this.isFirstImpression) {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'package' }));
        }
    }
    onChoosePaymentStepActive() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentInfo' }));
    }
    onReviewOrderStepActive() {
        this.ccError = false;
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'review' }));
    }
    goToRadioLookupPage() {
        this._router.navigate(['/transfer/radio/lookup']);
    }
    goToPortRadioPage() {
        this._router.navigate(['/transfer/radio/port']);
    }

    private _getAnalyticsPayKeyFromMode(mode: DefaultMode): string {
        switch (mode) {
            case DefaultMode.SC_ONLY:
                return 'servicecontinuity';

            case DefaultMode.AC_ONLY:
                return 'accountconsolidation';

            default:
                return 'scac';
        }
    }
}
