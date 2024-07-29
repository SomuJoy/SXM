import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CdkStepper } from '@angular/cdk/stepper';
import { scrollToElementBySelector } from '@de-care/browser-common';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import {
    getShowPortPaymentPage,
    setPaymentInfo,
    setPaymentTypeAsCreditCard,
    clearPaymentInfo,
    setPaymentMethodAsNotCardOnFile,
    getDisplayPriceChangeMessage,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { PaymentInfoSubmission } from '../../page-parts/port-payment/port-payment.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'de-care-port-radio-page',
    templateUrl: './port-radio-page.component.html',
    styleUrls: ['./port-radio-page.component.scss'],
})
export class PortRadioPageComponent implements OnInit, AfterViewInit {
    @ViewChild('stepper') private readonly _stepper: CdkStepper;
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.PortRadioPageComponent.';
    showPortPaymentPage$ = this._store.pipe(select(getShowPortPaymentPage));
    startingStepIndex = 0;
    displayPriceChangeMessage$ = this._store.pipe(select(getDisplayPriceChangeMessage));

    constructor(private readonly _store: Store, private readonly _router: Router, private readonly _activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this.showPortPaymentPage$.pipe().subscribe((showPortPaymentPage) => (this.startingStepIndex = showPortPaymentPage ? 0 : 1));
    }

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
    }

    nextAndScrollUp() {
        this._stepper.next();
        scrollToElementBySelector('[data-scroll="scroll-top"]');
    }

    previousAndScrollUp() {
        this._stepper.previous();
        scrollToElementBySelector('[data-scroll="scroll-top"]');
    }

    onPaymentStepActive() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'serviceportability', componentKey: 'paymentinfo' }));
    }

    onReviewStepActive() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'serviceportability', componentKey: 'review' }));
    }

    onPaymentFormComplete(paymentInfo: PaymentInfoSubmission): void {
        this._store.dispatch(setPaymentMethodAsNotCardOnFile());
        if (paymentInfo.paymentForm?.ccNum) {
            this._store.dispatch(setPaymentInfo({ paymentInfo: paymentInfo.paymentForm }));
            this._store.dispatch(setPaymentTypeAsCreditCard());
        } else {
            this._store.dispatch(clearPaymentInfo());
        }

        //go to review page
        this.nextAndScrollUp();
    }

    onSubmitTransactionComplete() {
        this._router.navigate(['./thanks'], { relativeTo: this._activatedRoute });
    }

    onBack(): void {
        if (this._stepper.selectedIndex === 1 && this.startingStepIndex === 0) {
            //review page and payment page should be shown
            this.previousAndScrollUp();
        } else {
            //go back to transfer page
            this._router.navigate(['../'], { relativeTo: this._activatedRoute });
        }
    }
}
