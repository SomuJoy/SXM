import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
    getSubscriptionInfo,
    getTransferFromInfo,
    getOrderSummaryData,
    SubmitTransactionWorkflowService,
    getSubmitTransactionAsProcessing,
    getIsModeServiceContinuity,
    getRemoveOldRadioId,
    getTrialRadioAccountSubscriptionFirstPlanPackageName,
    getPaymentType,
    getIsTrialEndingImmediately,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { Router } from '@angular/router';

@Component({
    selector: 'de-care-review-order',
    templateUrl: './review-order.component.html',
    styleUrls: ['./review-order.component.scss'],
})
export class ReviewOrderComponent {
    @Input() priceChangeMessagingTypeFeatureFlag: boolean;
    @Input() priceChangeMessagingType: string;

    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.ReviewOrderComponent.';
    subscriptionData$ = this._store.pipe(select(getSubscriptionInfo));
    trialPackageName$ = this._store.pipe(select(getTrialRadioAccountSubscriptionFirstPlanPackageName));
    transferFromData$ = this._store.pipe(select(getTransferFromInfo));
    orderSummaryData$ = this._store.pipe(select(getOrderSummaryData));
    getSubmitTransactionAsProcessing$ = this._store.pipe(select(getSubmitTransactionAsProcessing));
    getIsModeServiceContinuity$ = this._store.pipe(select(getIsModeServiceContinuity));
    getRemoveOldRadioId$ = this._store.pipe(select(getRemoveOldRadioId));
    paymentType$ = this._store.pipe(select(getPaymentType));
    isTrialEndingImmediately$ = this._store.pipe(select(getIsTrialEndingImmediately));

    submitted = false;
    agreementAccepted = false;
    @Output() submitTransactionComplete = new EventEmitter();
    @Output() submitTransactionCompleteWithCCError = new EventEmitter();

    constructor(private readonly _store: Store, private readonly _submitTransactionWorkflowService: SubmitTransactionWorkflowService, private _router: Router) {}

    onConfirmReviewAndSubmit() {
        this.submitted = true;
        if (this.agreementAccepted) {
            this._submitTransactionWorkflowService.build().subscribe(
                (_) => {
                    this.submitTransactionComplete.emit();
                },
                (error) => {
                    if (error === 'CREDIT_CARD_FAILURE') {
                        this.submitTransactionCompleteWithCCError.emit();
                    } else {
                        this._router.navigate(['/error']);
                    }
                }
            );
        }
    }
}
