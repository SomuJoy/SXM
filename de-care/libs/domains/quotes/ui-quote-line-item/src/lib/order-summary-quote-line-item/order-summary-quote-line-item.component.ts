import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

interface LineItemData {
    shouldNotShowLineItem: boolean;
    amount: string;
    title?: string;
    titleE2e?: string;
    amountE2e?: string;
    subText?: string;
    parentDataAttribute?: string;
}

@Component({
    selector: 'order-summary-quote-line-item',
    templateUrl: './order-summary-quote-line-item.component.html',
    styleUrls: ['./order-summary-quote-line-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderSummaryQuoteLineItemComponent {
    @Input() lineItemData: LineItemData;
}
