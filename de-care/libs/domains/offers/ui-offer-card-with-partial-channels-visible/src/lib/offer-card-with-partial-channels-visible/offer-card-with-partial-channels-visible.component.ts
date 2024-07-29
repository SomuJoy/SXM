import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { SharedEventTrackService } from '@de-care/data-layer';
import { OfferInfo } from '@de-care/domains/offers/ui-offer-description';
import { Channel } from '@de-care/domains/offers/ui-plan-description-channels';

export interface PackageDescriptionViewModel {
    channels: Channel[];
    description?: string;
    header?: string;
    footer: string;
}

export interface ChannelViewModel {
    title?: string;
    descriptions?: Array<string>;
}

@Component({
    selector: 'offer-card-with-partial-channels-visible',
    templateUrl: './offer-card-with-partial-channels-visible.component.html',
    styleUrls: ['./offer-card-with-partial-channels-visible.component.scss']
})
export class OfferCardWithPartialChannelsVisibleComponent implements OnChanges {
    @Input() isRTC: boolean = false;
    @Input() offerInfo: OfferInfo;
    @Input() excludePriceAndTermDisplay = false;
    @Input() opened = false;
    @Input() packageDescription: PackageDescriptionViewModel;
    @Input() selectedRenewalOfferPrice: number;
    @Input() hidePlanGrid = false;
    @Input() channelLimit = 1;
    @Input() showChannelTitle = false;

    translationKeyPrefix = 'DomainsOffersUiOfferCardWithPartialChannelsVisibleModule.OfferCardWithPartialChannelsVisibleComponent.';
    overChannelLimit = false;
    visibleChannels: Array<ChannelViewModel> = [];
    accordionChannels: Array<ChannelViewModel> = [];

    constructor(private readonly _eventTrackingService: SharedEventTrackService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.packageDescription) {
            const channelObj = changes.packageDescription.currentValue?.channels?.[0];
            if (channelObj?.descriptions) {
                this.overChannelLimit = channelObj.descriptions.length > this.channelLimit;
                const visibleDescription = this.overChannelLimit ? channelObj.descriptions.slice(0, this.channelLimit) : channelObj.descriptions.slice();
                const accordionDescription = this.overChannelLimit ? channelObj.descriptions.slice(this.channelLimit) : [];

                this.visibleChannels[0] = { title: this.showChannelTitle ? channelObj.title : null, descriptions: visibleDescription };
                this.accordionChannels[0] = { title: null, descriptions: accordionDescription };
            }
        }
    }

    trackEvent(evt): void {
        this._eventTrackingService.track('view-more', { componentName: 'high-level-info' });
    }
}
