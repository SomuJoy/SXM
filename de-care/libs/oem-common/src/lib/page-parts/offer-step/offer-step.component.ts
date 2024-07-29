import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PackageModel } from '@de-care/data-services';

@Component({
    selector: 'offer-step',
    templateUrl: './offer-step.component.html',
    styleUrls: ['./offer-step.component.scss'],
})
export class OfferStepComponent {
    @Input() offer: PackageModel;
    @Input() legalCopy: string;

    @Output() submitted = new EventEmitter();
}
