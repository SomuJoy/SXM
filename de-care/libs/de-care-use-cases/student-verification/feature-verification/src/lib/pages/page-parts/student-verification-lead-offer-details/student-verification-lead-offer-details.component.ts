import { CurrencyPipe, I18nPluralPipe } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { calcSavingsPercent, isOfferMCP, isOfferRTP, PackageModel, PlanTypeEnum } from '@de-care/data-services';
import { offerTypeIsAdvantage } from '@de-care/domains/offers/state-offers';
import { PackageDescriptionViewModel } from '@de-care/domains/offers/ui-offer-card';
import { OfferInfo } from '@de-care/domains/offers/ui-offer-description';
import { SettingsService } from '@de-care/settings';
import { IconsDataModel } from '@de-care/shared/sxm-ui/ui-package-icons';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

export interface PackageDescriptionFooterInterpolation {
    price: string;
    monthsPluralized: string;
    savings: number;
    termLength: number;
    perMonth: string;
    retailPrice: string;
}
interface OfferDescriptionModel {
    platformPlan: string;
    priceAndTermDescTitle: string;
    processingFeeDisclaimer: string;
    icons: IconsDataModel;
    opened: boolean;
    details: { title: string; description: string[] }[];
    footer: string;
    theme: string;
    presentation: string;
}

@Component({
    selector: 'de-care-student-verification-lead-offer-details',
    templateUrl: './student-verification-lead-offer-details.component.html',
    styleUrls: ['./student-verification-lead-offer-details.component.scss'],
    providers: [CurrencyPipe, I18nPluralPipe],
})
export class StudentVerificationLeadOfferDetailsComponent implements OnChanges, OnDestroy {
    @Input() offer: PackageModel;
    @Input() followOnOfferPrice: number;
    @Input() isLegacyMode = true;
    @Input() isStreaming: boolean;
    @Input() offerDescriptionData: OfferDescriptionModel;
    @Input() chevronClickTrackingText = 'Explore More';

    offerInfo: OfferInfo;
    maskedUsername: string;
    packageDescriptionViewModel: PackageDescriptionViewModel;
    private _parentPackageName: string;
    private _unsubscribe: Subject<void> = new Subject();

    constructor(
        private _translateService: TranslateService,
        private _currencyPipe: CurrencyPipe,
        private _i18nPluralPipe: I18nPluralPipe,
        private _settingsService: SettingsService
    ) {}

    ngOnChanges(simpleChanges: SimpleChanges) {
        if (simpleChanges.offer && simpleChanges.offer.currentValue) {
            this._updatePackageDescriptions(this.offer);
            this.offerInfo = {
                packageName: this.offer.packageName,
                pricePerMonth: this.offer.pricePerMonth,
                retailPrice: this.offer.retailPrice,
                termLength: this.offer.termLength,
                price: this.offer.price,
                isMCP: isOfferMCP(this.offer.type),
                offerType: this.offer.type,
                minimumFollowOnTerm: this.offer.minimumFollowOnTerm,
                processingFee: this.offer.processingFee,
                deal: this.offer.deal,
                isStreaming: this.isStreaming,
                parentPackageName: this._parentPackageName,
                isStudentOffer: this.offer.student,
                mrdEligible: this.offer.mrdEligible,
                msrpPrice: this.offer.msrpPrice,
                isAdvantage: this.offer.advantage,
            };
        }
        if (simpleChanges.followOnOfferPrice && simpleChanges.followOnOfferPrice.currentValue) {
            this.offerInfo.followOnOfferPrice = this.followOnOfferPrice;
        }
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private _updatePackageDescriptions(offer: PackageModel): void {
        // update the current value
        let descriptionPackageName = offer.packageName;
        let currentPackageDescription = this._translateService.instant(`app.packageDescriptions.${descriptionPackageName}`);
        this._parentPackageName = '';

        // if the currentPackageDescription has a parentPackageName, use the description from the parent package instead
        if (currentPackageDescription.parentPackageName) {
            this._parentPackageName = currentPackageDescription.parentPackageName;
            descriptionPackageName = currentPackageDescription.parentPackageName;
            currentPackageDescription = this._translateService.instant(`app.packageDescriptions.${descriptionPackageName}`);
        }

        this.packageDescriptionViewModel = this._buildPackageDescriptionsViewModel(currentPackageDescription, offer);
        // subscribe to language changes to update future values
        this._translateService.onLangChange
            .pipe(
                takeUntil(this._unsubscribe),
                map(() => this._translateService.instant(`app.packageDescriptions.${descriptionPackageName}`))
            )
            .subscribe((packageDescription) => {
                this.packageDescriptionViewModel = this._buildPackageDescriptionsViewModel(packageDescription, offer);
            });
    }

    private _buildPackageDescriptionsViewModel(packageDescription, offer: PackageModel): PackageDescriptionViewModel | null {
        if (typeof packageDescription === 'object') {
            return {
                channels: packageDescription.channels,
                description: packageDescription.description,
                footer: this.getOfferDescriptionFooter(offer, packageDescription),
            };
        } else {
            return null;
        }
    }

    getOfferDescriptionFooter(offer, packageDescription): string {
        let isCanadianNonSelfPay = false;
        let isUSPromoMCPRTP = false;
        if (offer.type) {
            isCanadianNonSelfPay = this._settingsService.isCanadaMode && offer.type !== PlanTypeEnum.SelfPay && offer.type !== PlanTypeEnum.SelfPaid && offer.price !== 0;
            isUSPromoMCPRTP = !this._settingsService.isCanadaMode && (offer.type === PlanTypeEnum.Promo || isOfferMCP(offer.type) || isOfferRTP(offer.type));
        }

        if ((offer.advantage || offerTypeIsAdvantage(offer.type)) && packageDescription.packageOverride && packageDescription.packageOverride.length > 0) {
            const pkgOverride = packageDescription.packageOverride.find((override) => override.type === PlanTypeEnum.Advantage);
            if (pkgOverride && pkgOverride.promoFooter) {
                return pkgOverride.promoFooter;
            }
        }

        if (
            packageDescription.promoFooter !== null && // promoFooter value is required in below calculation
            isUSPromoMCPRTP
        ) {
            const offerDescriptionFooter = this._translateService.instant(
                'offers.leadOfferDetailsComponent.DETAILS_FOOTER_SUFFIX',
                this.getPackageDescriptionInterpolationValues(offer)
            );

            return `${packageDescription.promoFooter || ''} ${offerDescriptionFooter}`;
        } else if (packageDescription.footer !== null) {
            return packageDescription.footer;
        }

        return '';
    }

    getPackageDescriptionInterpolationValues(offer: PackageModel): PackageDescriptionFooterInterpolation {
        const monthPluralMap = this._translateService.instant('offers.leadOfferDetailsComponent.PLURAL_MAP.MONTH');

        return {
            price: this._currencyPipe.transform(offer.price, 'USD', 'symbol-narrow', undefined, this._translateService.currentLang),
            perMonth: isOfferMCP(offer.type) ? this._translateService.instant('offers.leadOfferDetailsComponent.PER_MONTH_COPY') : '',
            monthsPluralized: this._i18nPluralPipe.transform(offer.termLength, monthPluralMap),
            termLength: offer.termLength,
            savings: calcSavingsPercent(offer),
            retailPrice: this._currencyPipe.transform(offer.retailPrice, 'USD', 'symbol-narrow', undefined, this._translateService.currentLang),
        };
    }
}
