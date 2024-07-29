import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

interface DealAddon {
    marketingCallout: string;
    title: string;
    partnerImage?: string;
    productImage?: String;
    description?: string;
    shownDescription?: string;
    toggleCollapsed?: string;
    toggleExpanded?: string;
    presentation?: string;
}

@Component({
    selector: 'sxm-ui-deal-addon-card',
    templateUrl: './deal-addon-card.component.html',
    styleUrls: ['./deal-addon-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class DealAddonCardComponent {
    @Input() copyContent: DealAddon[];
}
