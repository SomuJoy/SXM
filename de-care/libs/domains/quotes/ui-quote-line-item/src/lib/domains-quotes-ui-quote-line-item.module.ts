import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderSummaryQuoteLineItemComponent } from './order-summary-quote-line-item/order-summary-quote-line-item.component';

const DECLARATIONS = [OrderSummaryQuoteLineItemComponent];

@NgModule({
    imports: [CommonModule],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS]
})
export class DomainsQuotesUiQuoteLineItemModule {}
