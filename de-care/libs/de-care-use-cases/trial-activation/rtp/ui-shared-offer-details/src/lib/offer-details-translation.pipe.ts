import { CurrencyPipe, I18nPluralPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { SxmLanguages } from '@de-care/app-common';
import { PlanTypeEnum } from '@de-care/data-services';
import { OfferDetails } from '@de-care/domains/offers/state-offers';
import { Offer } from '@de-care/domains/offers/state-renewals';
import { CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT, CURRENCY_PIPE_ZERO_DECIMAL_NUMBER_FORMAT } from '@de-care/settings';
import { WithoutPlatformNamePipe } from '@de-care/sxm-ui';
import { TranslateService } from '@ngx-translate/core';

export interface OfferDetailsInput {
    offerDetails: OfferDetails;
    language: SxmLanguages;
    isChoiceOrMM: boolean;
    renewals: Offer[];
    renewalsIncludeChoice: boolean;
    offers?: Offer[];
}

@Pipe({ name: 'offerDetailsTranslation' })
export class OfferDetailsTranslationPipe implements PipeTransform {
    constructor(
        private readonly _translateService: TranslateService,
        private _withoutPlatformNamePipe: WithoutPlatformNamePipe,
        private _currencyPipe: CurrencyPipe,
        private _i18nPluralPipe: I18nPluralPipe
    ) {}

    transform(offerDetailsCopy: string, offerInput: OfferDetailsInput): string {
        const { offerDetails, language, isChoiceOrMM, renewals, renewalsIncludeChoice, offers } = offerInput;

        if (offers && offers.length > 1) {
            return this._translateService.instant(offerDetailsCopy, {
                trialTerm: offerDetails.offerTerm,
                monthsPluralized: this._monthMap(offerDetails.offerTerm),
                trialTermPlusOne: +offerDetails.offerTerm + 1,
                trialPrice: this._getPriceWithDecimal(offerDetails.offerTotal, CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT, language),
                processingFee: this._currencyPipe.transform(offerDetails.processingFee, 'USD', 'symbol-narrow', CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT, language),
                packageName_1: this._getPackageName(offers[2]['parentPackageName'] ? offers[2]['parentPackageName'] : offers[2].packageName),
                packageName_2: this._getPackageName(offers[1]['parentPackageName'] ? offers[1]['parentPackageName'] : offers[1].packageName),
                packageName_3: this._getPackageName(offers[0]['parentPackageName'] ? offers[0]['parentPackageName'] : offers[0].packageName),
                renewalPriceWithCents_1: this._getPriceWithDecimal(offers[2]?.retailPrice, CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT, language),
                renewalPriceWithCents_2: this._getPriceWithDecimal(offers[1]?.retailPrice, CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT, language),
                renewalPriceWithCents_3: this._getPriceWithDecimal(
                    // TODO TEMPORARY PRICE PATCH UNTILL SMS RETURNS THE APPROPRIATE PRICE
                    this._shouldMapQCChoicePrice(offers[0]) ? 9.6 : offers[0]?.retailPrice,
                    CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT,
                    language
                )
            });
        } else if (!isChoiceOrMM) {
            return this._translateService.instant(offerDetailsCopy, {
                packageType: this._withoutPlatformNamePipe.transform(
                    this._translateService.instant('app.packageDescriptions.' + offerDetails.name + '.name'),
                    offerDetails.name
                ),
                trialTerm: offerDetails.offerTerm,
                monthsPluralized: this._monthMap(offerDetails.offerTerm),
                trialTermPlusOne: +offerDetails.offerTerm + 1,
                trialPrice: this._currencyPipe.transform(
                    offerDetails.offerTotal,
                    'USD',
                    'symbol-narrow',
                    this._determinePriceDecimalFormat(offerDetails.offerTotal, offerDetails.type as PlanTypeEnum),
                    language
                ),
                processingFee: this._currencyPipe.transform(
                    offerDetails.processingFee,
                    'USD',
                    'symbol-narrow',
                    this._determinePriceDecimalFormat(offerDetails.offerTotal, offerDetails.type as PlanTypeEnum),
                    language
                ),
                monthlyRenewalPrice: this._currencyPipe.transform(
                    offerDetails.msrpPrice,
                    'USD',
                    'symbol-narrow',
                    this._determinePricePerMonthDecimalFormat(offerDetails.msrpPrice),
                    language
                ),
                activationFees: this._currencyPipe.transform(15, 'USD', 'symbol-narrow', this._determinePricePerMonthDecimalFormat(15), language),
                renewalName: this._withoutPlatformNamePipe.transform(
                    this._translateService.instant('app.packageDescriptions.' + offerDetails.renewalName + '.name'),
                    offerDetails.renewalName
                ),
                renewalPrice: offerDetails.renewalPrice,
                renewalTermLength: offerDetails.renewalTermLength
            });
        } else {
            return this._getNOUVChoiceMMCopy(offerDetailsCopy, offerDetails, language, isChoiceOrMM, renewals, renewalsIncludeChoice);
        }
    }

    private _shouldMapQCChoicePrice(offer: Offer): boolean {
        return offer.retailPrice === 9.59 && offer.packageName.includes('SIR_CAN_CHOICE');
    }

    private _monthMap(term: number): string {
        const pluralMonthMap = this._translateService.instant('deCareUseCasesTrialActivationRtpUiSharedOfferDetailsModule.sharedOfferDetailsComponent.' + 'PLURAL_MAP.MONTH');
        const mappedPluralMonth = this._i18nPluralPipe.transform(term, pluralMonthMap);
        return mappedPluralMonth;
    }

    private _determinePriceDecimalFormat(price: number, type: PlanTypeEnum): string {
        return price === 0 ? CURRENCY_PIPE_ZERO_DECIMAL_NUMBER_FORMAT : CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT;
    }

    private _determinePricePerMonthDecimalFormat(price: number): string {
        return Number.isInteger(price) ? CURRENCY_PIPE_ZERO_DECIMAL_NUMBER_FORMAT : CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT;
    }

    private _getNOUVChoiceMMCopy(
        offerDetailsCopy: string,
        offerDetails: OfferDetails,
        language: string,
        isChoiceOrMM: boolean,
        renewals: Offer[],
        renewalsIncludeChoice: boolean
    ) {
        return this._translateService.instant(offerDetailsCopy, {
            packageName: this._getPackageName(offerDetails.name),
            trialTerm: offerDetails.offerTerm,
            trialTermPlusOne: offerDetails.offerTerm + 1,
            monthsPluralized: this._monthMap(offerDetails.offerTerm),
            processingFee: this._getPriceWithDecimal(offerDetails.processingFee, CURRENCY_PIPE_ZERO_DECIMAL_NUMBER_FORMAT, language),
            shortPackageName_1: this._getPackageName(renewalsIncludeChoice ? renewals[0]['parentPackageName'] : renewals[0].packageName),
            renewalPriceWithCents_1: this._getPriceWithDecimal(renewals[0]?.pricePerMonth, CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT, language),
            shortPackageName_2: this._getPackageName(renewals[1]?.packageName),
            renewalPriceWithCents_2: this._getPriceWithDecimal(renewals[1]?.pricePerMonth, CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT, language),
            shortPackageName_3: this._getPackageName(renewals[2]?.packageName),
            renewalPriceWithCents_3: this._getPriceWithDecimal(renewals[2]?.pricePerMonth, CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT, language)
        });
    }

    private _getPackageName(name): string {
        return this._withoutPlatformNamePipe.transform(this._translateService.instant('app.packageDescriptions.' + name + '.name'), name);
    }

    private _getPriceWithDecimal(price, format, language): string {
        return this._currencyPipe.transform(price, 'USD', 'symbol-narrow', format, language);
    }
}
