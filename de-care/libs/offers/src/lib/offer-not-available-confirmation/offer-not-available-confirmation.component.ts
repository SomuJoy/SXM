import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { OfferNotAvailableReasonEnum } from '@de-care/data-services';

@Component({
    selector: 'offer-not-available-confirmation',
    templateUrl: './offer-not-available-confirmation.component.html',
    styleUrls: ['./offer-not-available-confirmation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferNotAvailableConfirmationComponent {
    @Input() offerNotAvailableReason: OfferNotAvailableReasonEnum;
    @Output() continueRequested = new EventEmitter();
}
