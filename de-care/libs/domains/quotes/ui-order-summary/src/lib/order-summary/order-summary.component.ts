// ===============================================================================
// Angular
import { Component, ViewEncapsulation } from '@angular/core';
import { CurrencyPipe, I18nPluralPipe } from '@angular/common';

// ===============================================================================
// Import Models
import { OrderSummaryBaseComponent } from './order-summary-base.component';

@Component({
    selector: 'order-summary',
    templateUrl: './order-summary.component.html',
    styleUrls: ['./order-summary.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [CurrencyPipe, I18nPluralPipe]
})
export class OrderSummaryComponent extends OrderSummaryBaseComponent {}
