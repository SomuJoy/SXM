import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'de-care-offer-details-wrapper',
    templateUrl: './offer-details-wrapper.component.html',
    styleUrls: ['./offer-details-wrapper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferDetailsWrapperComponent implements OnInit {
    @Input() copy: string;
    constructor() {}

    ngOnInit(): void {}
}
