import { Component, Input } from '@angular/core';

@Component({
    selector: 'de-care-tier-up-current-charges-message',
    template: `
        <p *ngIf="!extraData?.isAnnual" class="dark-gray-header">{{ translateKeyPrefix + 'CURRENT_CHARGES' | translate }}</p>
        <p>{{ translateKeyPrefix + 'ABOUT_UPGRADE' + (extraData?.isAnnual ? '_ANNUAL' : '') | translate }}</p>
        <p>{{ translateKeyPrefix + 'INSTRUCTION_TEXT' | translate }}</p>
        <div *ngIf="extraData?.isAnnual" class="margin-bottom-12px"></div>
    `,
    styleUrls: ['./current-charges-message.component.scss'],
})
export class CurrentChargesMessageComponent {
    @Input() extraData;
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeModule.CurrentChargesMessageComponent.';
}
