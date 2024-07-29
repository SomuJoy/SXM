import { CurrencyPipe, I18nPluralPipe } from '@angular/common';
import { Component } from '@angular/core';

import { LeadOfferDetailsBaseComponent } from '../lead-offer-details-base.component';

@Component({
    selector: 'lead-offer-details-oem',
    templateUrl: './lead-offer-details-oem.component.html',
    styleUrls: ['./lead-offer-details-oem.component.scss'],
    providers: [CurrencyPipe, I18nPluralPipe]
})
export class LeadOfferDetailsOemComponent extends LeadOfferDetailsBaseComponent {}
