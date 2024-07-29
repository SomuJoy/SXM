import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

interface DealAddon {
    marketingCallout: string;
    title: string;
    partnerImage?: string;
    productImage?: string;
    description?: string;
    shownDescription?: string;
    toggleCollapsed?: string;
    toggleExpanded?: string;
    presentation?: string;
}

@Component({
    selector: 'sxm-ui-deal-addon-card-separated',
    templateUrl: './deal-addon-card-separated.component.html',
    styleUrls: ['./deal-addon-card-separated.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class DealAddonCardSeparatedComponent {
    @Input() copyContent: DealAddon[];
}
