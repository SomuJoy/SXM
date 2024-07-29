import { Component, Input } from '@angular/core';

interface LineItem {
    amount: string;
    label: string;
    tooltip?: string;
}

@Component({
    selector: 'sxm-ui-standalone-line-item',
    templateUrl: './standalone-line-item.component.html',
    styleUrls: ['./standalone-line-item.component.scss'],
})
export class StandaloneLineItemComponent {
    @Input() lineItem: LineItem;
    translateKeyPrefix = 'SharedSxmUiUiQuoteModule.StandaloneLineItemComponent.';
}
