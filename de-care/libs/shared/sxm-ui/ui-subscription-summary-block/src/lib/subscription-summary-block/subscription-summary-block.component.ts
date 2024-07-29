import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface SubscriptionSummaryData {
    last4DigitsOfAccountNumber: string;
    last4DigitsOfRadioId: string;
    vehicleInfo?: { year?: string; make?: string; model?: string };
    packageNames: string[];
}

@Component({
    selector: 'sxm-ui-subscription-summary-block',
    templateUrl: './subscription-summary-block.component.html',
    styleUrls: ['./subscription-summary-block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionSummaryBlockComponent {
    translateKeyPrefix = 'SharedSxmUiUiSubscriptionSummaryBlockModule.SubscriptionSummaryBlockComponent.';

    @Input() subscription: SubscriptionSummaryData;
}
