import { Component, Input } from '@angular/core';

@Component({
    selector: 'de-care-tier-up-offer',
    templateUrl: './tier-up-offer.component.html',
    styleUrls: ['./tier-up-offer.component.scss'],
})
export class TierUpOfferComponent {
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeModule.TierUpOfferComponent';
    @Input() data: {
        header: string;
        descriptions: string[];
        additionalFeatures: string[];
    };
}
