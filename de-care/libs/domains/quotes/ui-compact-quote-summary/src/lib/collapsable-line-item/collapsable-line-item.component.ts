import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LineItem } from '../compact-quote-summary/compact-quote-summary.component';

export interface CollapsableData {
    innerLines: LineItem[];
    outerLine: LineItem;
}

@Component({
    selector: 'de-care-collapsable-line-item',
    templateUrl: './collapsable-line-item.component.html',
    styleUrls: ['./collapsable-line-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeCareCollapsableLineItemComponent {
    @Input() data: CollapsableData;
    @Input() isCollapsed = false;
}
