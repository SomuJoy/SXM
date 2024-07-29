import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

interface DealAddon {
    title: string;
    productImage?: string;
    descriptions?: string[];
}

@Component({
    selector: 'sxm-ui-deal-redemption-instructions',
    templateUrl: './deal-redemption-instructions.component.html',
    styleUrls: ['./deal-redemption-instructions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiDealRedemptionInstructionsComponent {
    @Input() copyContent: DealAddon;
    @HostBinding('attr.data-test') dataTestAttribute = 'dealRedemptionInstructions';
}
