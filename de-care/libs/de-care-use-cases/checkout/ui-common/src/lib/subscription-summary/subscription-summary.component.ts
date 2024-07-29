import { Component, Input } from '@angular/core';

@Component({
    selector: 'de-care-subscription-summary',
    templateUrl: './subscription-summary.component.html',
    styleUrls: ['./subscription-summary.component.scss'],
})
export class SubscriptionSummaryComponent {
    translateKeyPrefix = 'DeCareUseCasesCheckoutUiCommonModule.SubscriptionSummaryComponent.';
    @Input() plans:
        | {
              name?: string;
              startDate?: string;
              endDate?: string;
              nextCycleOn?: string;
              closedDate?: string;
              isTrial?: boolean;
              isPromo?: boolean;
              isClosed?: boolean;
          }[]
        | null;
}
