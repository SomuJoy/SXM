import { Component, Input, SimpleChanges, OnChanges, OnInit, OnDestroy, ContentChild, TemplateRef } from '@angular/core';
import { OfferDealModel } from '@de-care/data-services';
import { dealTypeIsAmazonDot, dealIsHulu } from '@de-care/domains/offers/state-offers';
import { WithoutPlatformNamePipe } from '@de-care/shared/sxm-ui/ui-without-platform-name-pipe';
import { TranslateService, TranslateParser } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

export interface PackageUpgradeInfo {
    packageUpgrade: string;
    termLength: number;
    packageName: string;
}

export interface DealOfferData {
    price: number;
    termLength: number;
}

type CardType = 'lead' | 'upsell';

@Component({
    selector: 'promo-deal',
    templateUrl: './promo-deal.component.html',
    styleUrls: ['./promo-deal.component.scss'],
})
export class PromoDealComponent implements OnChanges, OnInit, OnDestroy {
    @ContentChild('customDetails')
    customDetailsContent: TemplateRef<any>;

    @Input() showDetails = false;
    @Input() packageUpgradeInfo: PackageUpgradeInfo;
    @Input() dealOfferData: DealOfferData;
    @Input() cardType: CardType = 'lead';
    @Input() deal: OfferDealModel;
    i18nKey = 'sales-common.promoDealComponent.';
    packageUpgradeOnly: boolean;
    upgradeTitle: string;
    dealTitle: string;
    dealSubtitle: string;
    channels: any[];
    dealName: string;
    titleImageSrc: string;

    dealDescription: string;
    isHulu = false;
    isAmazonDot = false;
    huluTranslationData: {
        price: number;
        termLength: number;
    };

    private langChangeSubscription$: Subscription;

    constructor(
        private readonly _translateService: TranslateService,
        private readonly _translateParser: TranslateParser,
        private readonly _withoutPlatformNamePipe: WithoutPlatformNamePipe
    ) {}

    ngOnInit() {
        this.langChangeSubscription$ = this._translateService.onLangChange.subscribe(() => {
            this.handleChannelsAndDealName();
            this.upgradeDealTitle();
            this.updateTitleImage();
        });
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        // TODO: probably don't need to check these on every change. Determine if moving these elsewhere or only checking for specific changes, will work.
        this.handleChannelsAndDealName();
        this.upgradeDealTitle();

        if (simpleChanges.deal) {
            this.updateTitleImage();
        }
    }

    private handleChannelsAndDealName() {
        if (this.deal && this.deal.type) {
            const packageDescription = this._translateService.instant(`app.packageDescriptions.${this.deal.type}`);
            this.channels = packageDescription.channels;
            this.dealName = packageDescription.name;
            this.processHuluData(packageDescription);
        }
    }

    private processHuluData(packageDescription): void {
        if (dealIsHulu(this.dealName)) {
            this.isHulu = true;
            this.dealDescription = packageDescription.description;
        }
    }

    private upgradeDealTitle() {
        this.packageUpgradeOnly = false;
        if (this.packageUpgradeInfo && (!this.deal || !this.deal.type)) {
            this.packageUpgradeOnly = true;
            this.upgradeTitle = this._translateService.instant(this.i18nKey + 'PROMO_UPGRADE_WITHOUT_DEAL.UPGRADE_TITLE');
        } else if (this.packageUpgradeInfo) {
            this.upgradeTitle = this._translateParser.interpolate(this._translateService.instant(this.i18nKey + 'PROMO_UPGRADE.' + this.deal.type + '.UPGRADE_TITLE'), {
                offer: this._getPackageNameWithoutPlatform(this.packageUpgradeInfo?.packageName),
                offerUpgradeTerm: this.packageUpgradeInfo?.termLength,
                offerUpgrade: this._getPackageNameWithoutPlatform(this.packageUpgradeInfo?.packageUpgrade),
            });
            this.dealTitle = this._translateService.instant(this.i18nKey + 'PROMO_UPGRADE.' + this.deal.type + '.TITLE');
            this.dealSubtitle = this._translateService.instant(this.i18nKey + 'PROMO_UPGRADE.' + this.deal.type + '.SUB_TITLE');
        } else if (this.deal) {
            this.upgradeTitle = null;
            if (this.channels && this.channels.length > 0) {
                let dealTitleText = '';
                if (dealTypeIsAmazonDot(this.deal.type)) {
                    dealTitleText = this.channels[0].title;
                    this.isAmazonDot = true;
                } else if (this.cardType === 'upsell') {
                    dealTitleText = this.channels[0].upsellTitle || this.channels[0].title;
                } else {
                    dealTitleText = this.channels[0].title;
                }
                // Temp fix needed by Hulu until moving to the use of CMS for content
                this.dealTitle = this._translateParser.interpolate(dealTitleText, { termLength: this.dealOfferData?.termLength });
            } else {
                this.dealTitle = '';
            }
        }
    }

    private updateTitleImage() {
        if (this.deal && this.deal.type) {
            const imageKey = `${this.i18nKey + this.deal.type}.${this.cardType.toUpperCase()}_TITLE_IMAGE.SRC`;
            this.titleImageSrc = this._translateService.instant(imageKey) !== imageKey ? this._translateService.instant(imageKey) : null;
        }
    }

    ngOnDestroy() {
        this.langChangeSubscription$?.unsubscribe();
    }

    private _getPackageNameWithoutPlatform(name): string {
        return this._withoutPlatformNamePipe.transform(this._translateService.instant('app.packageDescriptions.' + name + '.name'), name);
    }
}
