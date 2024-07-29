import { Component, Input } from '@angular/core';
import { SharedEventTrackService } from '@de-care/data-layer';
import { OfferInfo } from '@de-care/domains/offers/ui-offer-description';
import { Channel } from '@de-care/domains/offers/ui-plan-description-channels';

export const selector = 'offer-card';

export interface PackageDescriptionViewModel {
    channels: Channel[];
    description?: string;
    subDescription?: string;
    header?: string;
    footer: string;
}

@Component({
    selector,
    templateUrl: './offer-card.component.html',
    styleUrls: ['./offer-card.component.scss']
})
export class OfferCardComponent {
    @Input() isRTC: boolean = false;
    @Input() offerInfo: OfferInfo;
    @Input() excludePriceAndTermDisplay = false;
    @Input() opened = false;
    @Input() packageDescription: PackageDescriptionViewModel;
    @Input() selectedRenewalOfferPrice: number;
    @Input() hidePlanGrid = false;

    translationKeyPrefix = 'domainsOffersUiOfferCardModule.offerCardComponent.';

    constructor(private readonly _eventTrackingService: SharedEventTrackService) {}

    trackEvent(evt): void {
        this._eventTrackingService.track('view-more', { componentName: 'high-level-info' });
    }
}
