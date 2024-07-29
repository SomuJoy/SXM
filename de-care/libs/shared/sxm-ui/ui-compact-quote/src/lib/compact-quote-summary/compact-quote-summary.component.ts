import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CollapsableData } from '../collapsable-line-item/collapsable-line-item.component';

export interface LineItem {
    amount: string;
    label: string;
    tooltip?: string;
}
export interface CompactQuoteBlock {
    innerLines: LineItem[];
    outerLine: LineItem;
}

export interface CompactQuoteData {
    quoteBlocks: CompactQuoteBlock[];
    title: LineItem;
}

/**
 * @deprecated Use DeCareCompactQuoteSummaryComponent instead
 */
@Component({
    selector: 'sxm-ui-compact-quote-summary',
    templateUrl: './compact-quote-summary.component.html',
    styleUrls: ['./compact-quote-summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiCompactQuoteSummaryComponent {
    dueToday: string;
    futureQuoteData: CollapsableData;
    promoRenewalQuoteData: CollapsableData;
    renewalQuoteData: CollapsableData;
    translateKeyPrefix = 'SharedSxmUiUiCompactQuoteModule.SxmUiCompactQuoteSummaryComponent.';
    @Input() compactQuoteData: CompactQuoteData;
    @Input() detailsCollapsed = true;

    toggleDetails() {
        this.detailsCollapsed = !this.detailsCollapsed;
    }
}
