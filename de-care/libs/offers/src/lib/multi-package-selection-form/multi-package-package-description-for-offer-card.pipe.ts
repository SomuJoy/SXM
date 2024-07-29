import { Pipe, PipeTransform } from '@angular/core';
import { PackageDescriptionModel } from '@de-care/domains/offers/state-package-descriptions';
import { TranslateOfferPromoFooterPipe } from '@de-care/domains/offers/ui-package-descriptions';
import { SettingsService } from '@de-care/settings';
import { isOfferMCP, isOfferRTP, offerTypeIsAdvantage } from '@de-care/domains/offers/state-offers';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyPipe, I18nPluralPipe } from '@angular/common';

interface OfferModel {
    type?: string;
    price: number;
    termLength: number;
    retailPrice: number;
    advantage?: boolean;
}
interface PackageDescriptionFooterInterpolation {
    price: string;
    monthsPluralized: string;
    savings: number;
    termLength: number;
    perMonth: string;
    retailPrice: string;
}
@Pipe({ name: 'multiPackagePackageDescriptionForOfferCard', pure: false })
export class MultiPackagePackageDescriptionForOfferCard implements PipeTransform {
    constructor(
        private readonly _translateOfferPromoFooterPipe: TranslateOfferPromoFooterPipe,
        private readonly _settingsService: SettingsService,
        private readonly _translateService: TranslateService,
        private readonly _currencyPipe: CurrencyPipe,
        private readonly _i18nPluralPipe: I18nPluralPipe
    ) {}

    transform(packageDescription: PackageDescriptionModel, offer: OfferModel): Partial<PackageDescriptionModel> {
        let isCanadianNonSelfPay = false;
        let isUSPromoMCPRTP = false;
        let isAdvantage = false;
        let promoFooter = '';
        if (offer.type) {
            isCanadianNonSelfPay = this._settingsService.isCanadaMode && offer.type !== 'SELF_PAY' && offer.type !== 'SELF_PAID' && offer.price !== 0;
            isUSPromoMCPRTP = !this._settingsService.isCanadaMode && (offer.type === 'PROMO' || isOfferMCP(offer.type) || isOfferRTP(offer.type));
            isAdvantage = offer.advantage || offerTypeIsAdvantage(offer.type);
        }
        if (
            packageDescription.promoFooter !== null && // promoFooter value is required in below calculation
            (isCanadianNonSelfPay || isUSPromoMCPRTP || isAdvantage)
        ) {
            // if there is an override for the promoFooter ONLY use that copy and not the additional footer suffix
            const isOverride = Boolean(Array.isArray(packageDescription.packageOverride) && packageDescription.packageOverride.find(i => i.type === offer.type));
            const offerDescriptionFooterLastFragment = isOverride
                ? ''
                : ` ${this._translateService.instant(
                      'offers.multiPackageSelectionFormComponent.DETAILS_FOOTER_SUFFIX',
                      this._getPackageDescriptionInterpolationValues(offer)
                  )}`;

            promoFooter = `${this._translateOfferPromoFooterPipe.getDescriptionContent(packageDescription, offer.type)}${offerDescriptionFooterLastFragment}`;
        }

        return {
            channels: packageDescription.channels,
            description: packageDescription.description,
            footer: promoFooter || packageDescription.footer,
            header: packageDescription.header
        };
    }

    private _getPackageDescriptionInterpolationValues(offer: OfferModel): PackageDescriptionFooterInterpolation {
        const monthPluralMap = this._translateService.instant('offers.multiPackageSelectionFormComponent.PLURAL_MAP.MONTH');

        return {
            price: this._currencyPipe.transform(offer.price, 'USD', 'symbol-narrow', undefined, this._translateService.currentLang),
            perMonth: isOfferMCP(offer.type) ? this._translateService.instant('offers.multiPackageSelectionFormComponent.PER_MONTH_COPY') : '',
            monthsPluralized: this._i18nPluralPipe.transform(offer.termLength, monthPluralMap),
            termLength: offer.termLength,
            savings: this._calculateSavingsPercent(offer),
            retailPrice: this._currencyPipe.transform(offer.retailPrice, 'USD', 'symbol-narrow', undefined, this._translateService.currentLang)
        };
    }

    private _calculateSavingsPercent(offer: OfferModel): number {
        const offerPrice = offer.price || 0;
        const retailPrice = offer.retailPrice || 0;
        const termLength = offer.termLength || 0;
        const isMCP = isOfferMCP(offer.type);
        return isMCP ? Math.floor(100 - (offerPrice / retailPrice) * 100) : Math.floor(100 - (offerPrice / (retailPrice * termLength)) * 100);
    }
}
