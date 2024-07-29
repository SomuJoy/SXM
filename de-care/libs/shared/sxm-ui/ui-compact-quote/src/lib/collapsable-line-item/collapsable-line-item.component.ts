import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LineItem } from '../compact-quote-summary/compact-quote-summary.component';

export interface CollapsableData {
    innerLines: LineItem[];
    outerLine: LineItem;
}

/**
 * @deprecated Use Component in DomainsQuotesUiCompactQuoteSummaryModule instead
 */
@Component({
    selector: 'sxm-ui-collapsable-line-item',
    templateUrl: './collapsable-line-item.component.html',
    styleUrls: ['./collapsable-line-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiCollapsableLineItemComponent {
    @Input() data: CollapsableData;
    @Input() isCollapsed = false;
}
