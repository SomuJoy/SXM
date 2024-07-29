import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OfferDealModel } from '@de-care/data-services';
import { PackageUpgradeInfo, DealOfferData } from '../promo-deal/promo-deal.component';

@Component({
    selector: 'promo-deal-card',
    templateUrl: './promo-deal-card.component.html',
    styleUrls: ['./promo-deal-card.component.scss'],
})
export class PromoDealCardComponent implements OnChanges {
    @Input() deal: OfferDealModel;
    @Input() packageUpgradeInfo: PackageUpgradeInfo;
    @Input() dealOfferData: DealOfferData;
    titleDealKey: string;
    titleUpgradeDealKey: string;
    titleDealParams: {
        termLength: number;
        packageUpgrade?: string;
    };
    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.packageUpgradeInfo && changes.packageUpgradeInfo.currentValue && (!changes.deal || !changes.deal.currentValue || !changes.deal.currentValue.type)) {
            this.titleDealKey = 'sales-common.promoDealCardComponent.PROMO_UPGRADE_WITHOUT_DEAL';
            this.titleDealParams = {
                termLength: this.packageUpgradeInfo.termLength,
            };
        } else if (changes.packageUpgradeInfo && changes.packageUpgradeInfo.currentValue) {
            this.titleDealKey = 'sales-common.promoDealCardComponent.PROMO_UPGRADE';
            this.titleUpgradeDealKey = 'sales-common.promoDealCardComponent.PROMO_UPGRADE.' + this.deal.type;
            this.titleDealParams = {
                termLength: this.packageUpgradeInfo.termLength,
                packageUpgrade: this.packageUpgradeInfo.packageUpgrade,
            };
        } else if (changes.deal && changes.deal.currentValue) {
            this.titleDealKey = 'app.packageDescriptions.' + this.deal.type;
        }
    }
}
