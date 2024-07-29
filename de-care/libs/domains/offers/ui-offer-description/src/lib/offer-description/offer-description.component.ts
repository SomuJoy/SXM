import { Component } from '@angular/core';

import { OfferDescriptionBaseComponent } from './offer-description-base.component';
export const selector = 'offer-description';

@Component({
    selector: 'offer-description',
    templateUrl: './offer-description.component.html',
    styleUrls: ['./offer-description.component.scss']
})
export class OfferDescriptionComponent extends OfferDescriptionBaseComponent {}
