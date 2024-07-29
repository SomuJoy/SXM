import { CurrencyPipe, I18nPluralPipe } from '@angular/common';
import { Component } from '@angular/core';

import { LeadOfferDetailsBaseComponent } from './lead-offer-details-base.component';

@Component({
    selector: 'lead-offer-details',
    templateUrl: './lead-offer-details.component.html',
    styleUrls: ['./lead-offer-details.component.scss'],
    providers: [CurrencyPipe, I18nPluralPipe]
})
export class LeadOfferDetailsComponent extends LeadOfferDetailsBaseComponent {}
