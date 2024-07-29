import { Component, Input } from '@angular/core';

interface LineItem {
    amount: string;
    label: string;
    tooltip?: string;
}
interface BaseChargesData {
    planName: string;
    planSubtotal: string;
    totalTaxesAndFeesAmount: string;
    fees: LineItem[];
    taxes: LineItem[];
    previousBalance: LineItem;
}
interface CurrentCharges extends BaseChargesData {
    planTermLength: number;
    planPricePerMonth: string;
    totalDue: string;
}
interface RenewalCharges extends BaseChargesData {
    startDate: string;
    totalDueOnStartDate: string;
}

export interface QuoteData {
    currentCharges: CurrentCharges;
    renewalCharges: RenewalCharges;
}

@Component({
    selector: 'sxm-ui-quote-summary',
    templateUrl: './quote-summary.component.html',
    styleUrls: ['./quote-summary.component.scss'],
})
export class SxmUiQuoteSummaryComponent {
    @Input() quoteData: QuoteData;
    translateKeyPrefix = 'SharedSxmUiUiQuoteModule.SxmUiQuoteSummaryComponent.';
}
