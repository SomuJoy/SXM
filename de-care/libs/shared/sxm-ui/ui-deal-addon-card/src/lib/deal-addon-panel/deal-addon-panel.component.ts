import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

interface DealAddon {
    title: string;
    productImage?: string;
    partnerImage?: string;
    description?: string;
}

@Component({
    selector: 'sxm-ui-deal-addon-panel',
    templateUrl: './deal-addon-panel.component.html',
    styleUrls: ['./deal-addon-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiDealAddonPanelComponent {
    @Input() copyContent: DealAddon;
}
