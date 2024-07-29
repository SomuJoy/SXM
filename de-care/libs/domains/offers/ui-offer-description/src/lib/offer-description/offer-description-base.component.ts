import { Input, OnInit, OnDestroy, OnChanges, SimpleChanges, Inject, Directive } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT, CURRENCY_PIPE_ZERO_DECIMAL_NUMBER_FORMAT, SettingsService, UserSettingsService } from '@de-care/settings';
import { OfferDealModel, PlanTypeEnum } from '@de-care/data-services';
import { offerTypeIsSelfPay, getOffersSavings, offerTypeIsAdvantage } from '@de-care/domains/offers/state-offers';

export interface OfferInfo {
    isFreeOffer?: boolean;
    type?: string;
    packageName: string;
    termLength?: number;
    pricePerMonth?: number;
    retailPrice?: number;
    price?: number;
    isMCP?: boolean;
    offerType?: string;
    processingFee?: number;
    minimumFollowOnTerm?: number;
    isStreaming?: boolean;
    deal?: OfferDealModel; // TODO: remove when no longer needed
    followOnOfferPrice?: number;
    isUpgradePromo?: boolean;
    parentPackageName?: string;
    isStudentOffer?: boolean;
    mrdEligible?: boolean;
    msrpPrice?: number;
    dataCapable?: boolean;
    isAdvantage?: boolean;
    isPickAPlan?: boolean;
}
export interface AdvantageTextCopyData {
    offerRetailPrice: number;
    savingsAmount: number;
}
// TODO: remove this when the price presentment no longer relies on the deal type
enum DealEnum {
    GOOGLE_HUB = 'GGLE_HUB',
    AMAZON_DOT = 'AMZ_DOT',
    GOOGLE_MINI = 'GGLE_MINI',
    APPLE = 'APPLE',
}

@Directive()
export class OfferDescriptionBaseComponent implements OnDestroy, OnInit, OnChanges {
    @Input() offerInfo: OfferInfo;
    @Input() excludePriceAndTermDisplay: boolean;
    @Input() isRTC: boolean = false;
    @Input() selectedRenewalOfferPrice: number;
    @Input() offerShortDescription: string;
    @Input() offerSubDescription: string;
    renewalOfferRetailPrice: number;
    currentLang: string;
    offerTermAndPrice: string;
    pricePerMonthDecimalFormat: string;
    priceDecimalFormat: string;
    msrpPricePerMonthDecimalFormat: string;
    advantageTextCopyData: AdvantageTextCopyData = null;
    advantageOfferDataKey: string;
    private isQuebec: boolean = false;
    private _isAdvantageOffer: boolean = false;
    private _isAnnualAdvantageOffer = false;
    private _unsubscribe: Subject<void> = new Subject();
    showNewSubscribersMessage = false;
    offerTypeIsRtdOrRtp: boolean;

    constructor(
        @Inject(TranslateService) private translateService: TranslateService,
        @Inject(SettingsService) private _settingsService: SettingsService,
        @Inject(UserSettingsService) private _userSettingsService: UserSettingsService
    ) {}

    ngOnInit() {
        this._setInitialOfferTermAndPriceKey();
        this.currentLang = this.translateService.currentLang;
        this.translateService.onLangChange.pipe(takeUntil(this._unsubscribe)).subscribe((ev) => {
            this.currentLang = ev.lang;
        });

        if (this._settingsService.isCanadaMode) {
            this._userSettingsService.isQuebec$.pipe(takeUntil(this._unsubscribe)).subscribe((isQuebec) => {
                this.isQuebec = isQuebec;
                this.getTermAndPriceMessage();
            });
        }

        this._checkAdvantageOffer();
        this.getTermAndPriceMessage();
        this.getaddAdvantageTextCopyData();
        this._setShowNewSubscribersMessage();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.offerInfo && changes.offerInfo.currentValue) {
            this._checkAdvantageOffer();
            this.getTermAndPriceMessage();
            this.getaddAdvantageTextCopyData();
        }
    }

    // TODO: Handle scenario for term and price monthly being Canada dependent
    private getTermAndPriceMessage(): void {
        this._setInitialOfferTermAndPriceKey();
        if (this.offerInfo.mrdEligible) {
            this.offerTermAndPrice = 'MRD_PRICE';
        } else if (this.offerInfo.isUpgradePromo) {
            this.offerTermAndPrice = this.offerInfo.isMCP ? 'TERM_AND_PRICE_MCP' : 'FULL_TERM_PRICE';
        } else if (offerTypeIsSelfPay(this.offerInfo.offerType || this.offerInfo.type)) {
            this.offerTermAndPrice = 'FULL_PRICE';
        } else if (this._isAdvantageOffer) {
            this.offerTermAndPrice = 'FULL_PRICE_ADVANTAGE' + (this._isAnnualAdvantageOffer ? '_ANNUAL' : '');
            this.advantageOfferDataKey =
                'SEE_OFFER_BELOW_ADVANTAGE' + (this._isAnnualAdvantageOffer ? '_ANNUAL' : '') + (this._settingsService.isCanadaMode && this.isQuebec ? '_QUEBEC' : '');
        } else if (this._settingsService.isCanadaMode && (this.offerInfo.price === 1 || this.offerInfo.offerType === PlanTypeEnum.TrialExtension)) {
            this.offerTermAndPrice = 'FULL_TERM_PRICE_QUEBEC';
        } else if (this.offerInfo.price === 0) {
            this.offerTermAndPrice = 'TERM_AND_PRICE_FREE';
        } else if (this.offerInfo.isStreaming && this.offerInfo.offerType === PlanTypeEnum.RtpOffer && this.offerInfo.deal && this.offerInfo.deal.type === DealEnum.APPLE) {
            this.offerTermAndPrice = 'FULL_TERM_PRICE_APPLE';
        } else if (
            this.offerInfo.offerType === PlanTypeEnum.RtpOffer ||
            this.offerInfo.offerType === PlanTypeEnum.TrialRtp ||
            this.offerInfo.offerType === PlanTypeEnum.LongTerm ||
            this.offerInfo.offerType === PlanTypeEnum.Trial ||
            (this.offerInfo.isStreaming && this.offerInfo.offerType === PlanTypeEnum.Promo)
        ) {
            this.offerTermAndPrice = 'FULL_TERM_PRICE';
        } else if (this.offerInfo.deal && (this.offerInfo.deal.type === DealEnum.GOOGLE_HUB || this.offerInfo.deal.type === DealEnum.GOOGLE_MINI) && !this.offerInfo.isMCP) {
            // TODO: Replace this block as soon as there is a better solution. This relies on deal type and is meant as a stopgap.
            this.offerTermAndPrice = 'FULL_TERM_PRICE';
        } else if (this._settingsService.isCanadaMode) {
            // TODO: this Canada logic needs a refactor so it doesn't have to be in this if else since there are overlapping scenarios
            if (this.offerInfo.isMCP) {
                this.offerTermAndPrice = 'TERM_AND_PRICE_MCP';
            } else {
                this.offerTermAndPrice = this.offerInfo.termLength === 1 ? 'TERM_AND_PRICE_MONTHLY' : 'TERM_AND_PRICE';
            }
        }

        if (this._settingsService.isCanadaMode && this.isQuebec) {
            const quebecProp = 'domainsOffersUiOfferDescriptionModule.offerDescriptionComponent.' + this.offerTermAndPrice + '_QUEBEC';
            if (this.translateService.instant(quebecProp) !== quebecProp) {
                this.offerTermAndPrice += '_QUEBEC';
            }
        }

        this._setDecimalFormats();
    }

    private _setDecimalFormats() {
        this.pricePerMonthDecimalFormat = this._determinePriceDecimalFormat(this.offerInfo.pricePerMonth);
        this.msrpPricePerMonthDecimalFormat = this._determinePriceDecimalFormat(this.offerInfo.msrpPrice);
        if (this._settingsService.isCanadaMode && (this.offerInfo.offerType === PlanTypeEnum.TrialExtension || this.offerInfo.offerType === PlanTypeEnum.Promo)) {
            this.priceDecimalFormat = CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT;
        } else {
            this.priceDecimalFormat = this._determinePriceDecimalFormat(this.offerInfo.price);
        }
    }

    _determinePriceDecimalFormat(price: number) {
        return Number.isInteger(price) ? CURRENCY_PIPE_ZERO_DECIMAL_NUMBER_FORMAT : CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT;
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private _setInitialOfferTermAndPriceKey() {
        this.offerTermAndPrice = 'TERM_AND_PRICE';
    }

    private _checkAdvantageOffer() {
        this._isAdvantageOffer = this.offerInfo.isAdvantage || offerTypeIsAdvantage(this.offerInfo.offerType || this.offerInfo.type);
        this._isAnnualAdvantageOffer = this._isAdvantageOffer && this.offerInfo?.termLength > 0 && this.offerInfo?.termLength % 12 === 0;
    }

    public showFollowOnPrice(): boolean {
        if (this.selectedRenewalOfferPrice && this.offerInfo.offerType === PlanTypeEnum.TrialExtensionRTC) {
            this.renewalOfferRetailPrice = this.selectedRenewalOfferPrice;
        } else {
            this.renewalOfferRetailPrice = this.offerInfo.retailPrice;
        }
        if (this.offerInfo.followOnOfferPrice && this.offerInfo.isStudentOffer && this.offerInfo.offerType === PlanTypeEnum.RtpOffer) {
            this.renewalOfferRetailPrice = this.offerInfo.followOnOfferPrice;
            return true;
        }
        //TODO For mcp plans minimumFollowOnTerm comes as 0 from OM, explicitly check plan ismcp plan then show followon price
        if (
            (this.offerInfo.minimumFollowOnTerm > 0 || this.offerInfo.isMCP) &&
            this.offerInfo.offerType !== PlanTypeEnum.SelfPay &&
            !(this.offerInfo.isStudentOffer && this.offerInfo.offerType === PlanTypeEnum.RtpOffer)
        ) {
            if (this._settingsService.isCanadaMode && !this.offerInfo.isStreaming) {
                return false;
            }
            return true;
        }
        return false;
    }

    public getaddAdvantageTextCopyData(): AdvantageTextCopyData {
        if (this._isAdvantageOffer) {
            const offerRetailPrice = this._isAnnualAdvantageOffer ? Math.round(this.offerInfo.retailPrice * 12 * 100) / 100.0 : this.offerInfo.retailPrice;
            return (this.advantageTextCopyData = {
                savingsAmount: getOffersSavings(offerRetailPrice, this.offerInfo.price),
                offerRetailPrice: offerRetailPrice,
            });
        }
    }

    private _setShowNewSubscribersMessage(): void {
        this.offerTypeIsRtdOrRtp =
            this.offerInfo?.offerType === PlanTypeEnum.RtpOffer || this.offerInfo?.offerType === PlanTypeEnum.TrialRtp || this.offerInfo?.offerType === PlanTypeEnum.RtdTrial;
        this.showNewSubscribersMessage = this.offerInfo.isStreaming && this.offerTypeIsRtdOrRtp;
    }
}
