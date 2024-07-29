import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoadPaymentAndReviewWorkflowService } from '@de-care/de-care-use-cases/checkout/state-streaming';

@Injectable({ providedIn: 'root' })
export class PaymentAndReviewCanActivateService implements CanActivate {
    constructor(private readonly loadPaymentAndReviewWorkflowService: LoadPaymentAndReviewWorkflowService) {}

    canActivate() {
        return this.loadPaymentAndReviewWorkflowService.build();
    }
}
