import { getProvinceIsQuebec, getIsCanadaMode } from '@de-care/domains/customer/state-locale';
import { Injectable } from '@angular/core';
import { OfferDetailsModel, OfferDetailsRTCModel } from '@de-care/data-services';
import { TranslateService, TranslateParser, LangChangeEvent } from '@ngx-translate/core';
import { WithoutPlatformNamePipe, WithoutPlatformNameWithArticlePipe, WithoutPlatformNameStreamingPipe } from '@de-care/sxm-ui';
import { CurrencyPipe, I18nPluralPipe } from '@angular/common';
import { combineLatest, BehaviorSubject, Observable, of } from 'rxjs';
import { UserSettingsService, CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT } from '@de-care/settings';
import { startWith, map, filter } from 'rxjs/operators';
import { offerTypeIsSelfPay, offerTypeIsAdvantage, getOffersSavings, OfferDetailsPickAPlanModel } from '@de-care/domains/offers/state-offers';
import { select, Store } from '@ngrx/store';
import { getAccountIsStreaming } from '@de-care/domains/account/state-account';

enum DealEnum {
    DEFAULT = 'DEFAULT',
    AMAZON_DOT = 'AMZ_DOT',
    MEGA_WINBACK_AMAZON_DOT = 'MEGA_WINBACK_AMZ_DOT',
    APPLE = 'APPLE',
    MEGA_APPLE = 'MEGA_APPLE',
    GOOGLE_MINI = 'GGLE_MINI',
    MEGA_LITE = 'MEGA_LITE',
}

export type OfferDetailsType = 'RTC' | 'PICKAPLAN' | 'FULLPRICE' | 'ADVANTAGE' | 'DEFAULT' | 'PICKAPLAN3FOR1PYP';
@Injectable()
export class OfferDetailsTranslateService {
    private _dealsKey = 'sales-common.OfferDetailsTranslateService.DEAL_TYPES';
    private _legalCopyKey = 'sales-common.OfferDetailsTranslateService.LEGAL_COPY';
    private _provinceKey = '_QUEBEC';
    private _streamingKey = '_STREAMING';
    private _ACSCKey = '_ACSC';
    private _rtcFirstPartKey = 'sales-common.OfferDetailsTranslateService.RTC.FIRST_PART';
    private _rtcLastParkKey = 'sales-common.OfferDetailsTranslateService.RTC.LAST_PART';
    private _rtcORKey = 'sales-common.OfferDetailsTranslateService.RTC.RENEWAL_PACKAGES_OR';
    private _rtcUNLESSKey = 'sales-common.OfferDetailsTranslateService.RTC.RENEWAL_PACKAGES_UNLESS';
    private _rtcPackagesPartKey = 'sales-common.OfferDetailsTranslateService.RTC.RENEWAL_PACKAGES_PART';
    private _fullPriceKey = 'sales-common.OfferDetailsTranslateService.FULL_PRICE';
    private _salesFullPriceKey = 'sales-common.OfferDetailsTranslateService.SALES_FULL_PRICE';
    private _priceFormat = CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT;
    private _pickAPlan3FOR1PYPFirstPartKey = 'sales-common.OfferDetailsTranslateService.PICK_A_PLAN_3FOR1PYP.FIRST_PART';
    private _pickAPlan3FOR1PYPMiddlePartKey = 'sales-common.OfferDetailsTranslateService.PICK_A_PLAN_3FOR1PYP.MIDDLE_PART';
    private _pickAPlan3FOR1PYPLastPartKey = 'sales-common.OfferDetailsTranslateService.PICK_A_PLAN_3FOR1PYP.LAST_PART';
    private _pickAPlan3FOR1PYPOrKey = 'sales-common.OfferDetailsTranslateService.PICK_A_PLAN_3FOR1PYP.PACKAGES_OR';
    private _pickAPlan3FOR1PYPPackagesPartKey = 'sales-common.OfferDetailsTranslateService.PICK_A_PLAN_3FOR1PYP.PACKAGES_PART';
    private _pickAPlan3FOR1PYPRenewalPackagesPartKey = 'sales-common.OfferDetailsTranslateService.PICK_A_PLAN_3FOR1PYP.RENEWAL_PACKAGES_PART';
    private _pickAPlanFirstPartKey = 'sales-common.OfferDetailsTranslateService.PICKAPLAN.FIRST_PART';
    private _pickAPlanMiddleParkKey = 'sales-common.OfferDetailsTranslateService.PICKAPLAN.MIDDLE_PART';
    private _pickAPlanLastParkKey = 'sales-common.OfferDetailsTranslateService.PICKAPLAN.LAST_PART';
    private _pickAPlanORKey = 'sales-common.OfferDetailsTranslateService.PICKAPLAN.PACKAGES_OR';
    private _pickAPlanPackagesPartKey = 'sales-common.OfferDetailsTranslateService.PICKAPLAN.PACKAGES_PART';
    private _pickAPlanRenewalPackagesPartKey = 'sales-common.OfferDetailsTranslateService.PICKAPLAN.RENEWAL_PACKAGES_PART';
    private _SELECTED_OFFER_DETAILS = 'sales-common.OfferDetailsTranslateService.PICKAPLAN.SELECTED_OFFER_DETAILS';

    private _initLangEvent: LangChangeEvent = { lang: this._translateService.currentLang, translations: null };
    private _offerDetailsSubject$ = new BehaviorSubject<OfferDetailsModel>(null);
    private _offerDetails$ = this._offerDetailsSubject$.pipe(filter((o) => o !== null));
    private _rtcDetailsSubject$ = new BehaviorSubject<OfferDetailsRTCModel>(null);
    private _rtcDetails$ = this._rtcDetailsSubject$.pipe(filter((o) => o !== null));

    private _pickAPlan3FOR1PYPSubject$ = new BehaviorSubject<OfferDetailsPickAPlanModel>(null);
    private _pickAPlan3FOR1PYPDetails$ = this._pickAPlan3FOR1PYPSubject$.pipe(filter((o) => o !== null));
    private _pickAPlanDetailsSubject$ = new BehaviorSubject<OfferDetailsPickAPlanModel>(null);
    private _pickAPlanDetails$ = this._pickAPlanDetailsSubject$.pipe(filter((o) => o !== null));
    private _selectedPlanOffer$ = new BehaviorSubject<string>(null);

    private _isACSC$ = new BehaviorSubject<boolean>(false);

    // NOTE: Hotfix to support legacy quebec check until legacy code can be fully removed.
    //       This aggregates together both sources and if either are true then in Quebec.
    private _isQuebec$ = combineLatest([this._store.pipe(select(getProvinceIsQuebec)), this._userSettingsService.isQuebec$]).pipe(
        map(([isQuebecFromState, isQuebecFromLegacy]) => isQuebecFromState || isQuebecFromLegacy)
    );

    private _langChange$ = this._translateService.onLangChange.pipe(startWith(this._initLangEvent));

    offerDetailsCopy$: Observable<string[]> = combineLatest([this._langChange$, this._isQuebec$, this._offerDetails$, this._store.pipe(select(getIsCanadaMode))]).pipe(
        map(([_, isQuebec, offerDetails, isCanada]) => {
            return this._updateDealKeys(offerDetails, isQuebec, isCanada);
        })
    );

    legalCopy$ = combineLatest([this._isQuebec$, this._langChange$]).pipe(map(([isQuebec, _]) => this._getLegalCopy(isQuebec)));

    rtcRenewalPackagesCopy$: Observable<string[]> = combineLatest([this._rtcDetails$, this._offerDetails$, this._langChange$]).pipe(
        map(([rtcDetails, offerDetails, langChange]) => this._getRTCRenewalPackagesCopy(rtcDetails, offerDetails, langChange))
    );

    rtcFirstPartCopy$: Observable<string> = combineLatest([this._offerDetails$, this._langChange$]).pipe(
        map(([details, langChange]) => this._getRTCFirstPartCopy(details, langChange))
    );

    rtcLastPartCopy$: Observable<string> = combineLatest([this._offerDetails$, this._langChange$]).pipe(map(([details, _]) => this._getRTCLastPartCopy(details)));

    pickAPlan3FOR1PYPPackagesCopy$: Observable<string[]> = this._pickAPlan3FOR1PYPDetails$.pipe(
        map((pickAPlan3FOR1PYPDetails) => this._getPickAPlan3FOR1PYPPackagesCopy(pickAPlan3FOR1PYPDetails))
    );

    pickAPlanPackagesCopy$: Observable<string[]> = combineLatest([this._pickAPlanDetails$, this._offerDetails$, this._langChange$, this._isQuebec$]).pipe(
        map(([pickAPlanDetails, offerDetails, langChange, isQuebec]) => this._getPickAPlanPackagesCopy(pickAPlanDetails, offerDetails, langChange, isQuebec))
    );

    selectedPlanOffer$: Observable<string[]> = combineLatest([this._pickAPlanDetails$, this._selectedPlanOffer$, this._langChange$, this._isQuebec$]).pipe(
        map(([pickAPlanDetails, selectedPlan, langChange, isQuebec]) => this._getSelectedOfferPlanDetails(pickAPlanDetails, selectedPlan, langChange, isQuebec))
    );

    pickAPlan3FOR1PYPRenewalPackagesCopy$: Observable<string[]> = combineLatest([this._pickAPlan3FOR1PYPDetails$, this._langChange$, this._isQuebec$]).pipe(
        map(([pickAPlanDetails, langChange, isQuebec]) => this._getPickAPlan3FOR1PYPRenewalPackagesCopy(pickAPlanDetails, langChange, isQuebec))
    );

    pickAPlanRenewalPackagesCopy$: Observable<string[]> = combineLatest([this._pickAPlanDetails$, this._offerDetails$, this._langChange$, this._isQuebec$]).pipe(
        map(([pickAPlanDetails, offerDetails, langChange, isQuebec]) => this._getPickAPlanRenewalPackagesCopy(pickAPlanDetails, offerDetails, langChange, isQuebec))
    );

    pickAPlan3FOR1PYPFirstPartCopy$: Observable<string> = of(this._getPickAPlan3FOR1PYPFirstPartCopy());

    pickAPlanFirstPartCopy$: Observable<string> = combineLatest([this._offerDetails$, this._langChange$, this._isQuebec$]).pipe(
        map(([details, langChange, isQuebec]) => this._getPickAPlanFirstPartCopy(details, langChange, isQuebec))
    );

    pickAPlan3FOR1PYPMiddlePartCopy$: Observable<string> = combineLatest([this._offerDetails$, this._langChange$, this._isQuebec$]).pipe(
        map(([details, langChange, isQuebec]) => this._getPickAPlan3FOR1PYPMiddlePartCopy(details, langChange, isQuebec))
    );

    pickAPlanMiddlePartCopy$: Observable<string> = combineLatest([this._offerDetails$, this._langChange$, this._isQuebec$]).pipe(
        map(([details, langChange, isQuebec]) => this._getPickAPlanMiddlePartCopy(details, langChange, isQuebec))
    );

    pickAPlan3FOR1PYPLastPartCopy$: Observable<string> = this._offerDetails$.pipe(map((details) => this._getPickAPlan3FOR1PYPLastPartCopy(details)));

    pickAPlanLastPartCopy$: Observable<string> = combineLatest([this._offerDetails$, this._langChange$, this._isQuebec$]).pipe(
        map(([details, langChange, isQuebec]) => this._getPickAPlanLastPartCopy(details, langChange, isQuebec))
    );

    offerDetailsType$: Observable<OfferDetailsType> = combineLatest([
        this._offerDetailsSubject$,
        this._rtcDetailsSubject$,
        this._pickAPlanDetailsSubject$,
        this._pickAPlan3FOR1PYPSubject$,
    ]).pipe(
        map(([offerDetails, rctDetails, pickAPlanDetails, pickAPlan3FOR1PYPDetails]) =>
            this._getOfferType(offerDetails, rctDetails, pickAPlanDetails, pickAPlan3FOR1PYPDetails)
        )
    );

    fullPriceCopy$ = combineLatest([
        this._isQuebec$,
        this._langChange$,
        this._store.pipe(select(getAccountIsStreaming)),
        this._store.pipe(select(getIsCanadaMode)),
        this._offerDetails$,
        this._isACSC$,
    ]).pipe(map(([isQuebec, _, isStreaming, isCanada, offerDetails, isACSC]) => this._getFullPriceCopy(isQuebec, isStreaming, isCanada, offerDetails, isACSC)));

    constructor(
        private _translateService: TranslateService,
        private _userSettingsService: UserSettingsService,
        private _withoutPlatformNamePipe: WithoutPlatformNamePipe,
        private _withoutPlatformNameWithArticlePipe: WithoutPlatformNameWithArticlePipe,
        private _withoutPlatformNameStreamingPipe: WithoutPlatformNameStreamingPipe,
        private _translateParse: TranslateParser,
        private _currencyPipe: CurrencyPipe,
        private _i18nPluralPipe: I18nPluralPipe,
        private _store: Store
    ) {}

    // Must be called to get offer details copy stream
    setOfferDetails(offerDetails: OfferDetailsModel): void {
        this._offerDetailsSubject$.next(offerDetails);
    }

    setRTCDetails(details: OfferDetailsRTCModel): void {
        this._rtcDetailsSubject$.next(details);
    }

    setSelectedOfferPlanName(offerName: string) {
        this._selectedPlanOffer$.next(offerName);
    }

    setPickAPlan3FOR1PYPDetails(details: OfferDetailsPickAPlanModel): void {
        this._pickAPlan3FOR1PYPSubject$.next(details);
    }

    setPickAPlanDetails(details: OfferDetailsPickAPlanModel): void {
        this._pickAPlanDetailsSubject$.next(details);
    }

    setIsACSC(isACSC: boolean) {
        this._isACSC$.next(isACSC);
    }

    private _getLegalCopy(isQuebec: boolean): string {
        return this._translateService.instant(this._legalCopyKey + this._getProvinceKey(isQuebec));
    }

    private _getRTCFirstPartCopy(details: OfferDetailsModel, locale: LangChangeEvent): string {
        return this._translateService.instant(this._rtcFirstPartKey, {
            processingFee: this._currencyPipe.transform(details.processingFee, 'USD', 'symbol-narrow', this._priceFormat, locale.lang),
            packageType: this._withoutPlatformNamePipe.transform(this._translateService.instant(`app.packageDescriptions.${details.name}.name`), details.name),
            term: details.offerTerm,
            fullSavings: this._currencyPipe.transform(
                (details.msrpPrice - details.offerMonthlyRate) * details.offerTerm,
                'USD',
                'symbol-narrow',
                this._priceFormat,
                locale.lang
            ),
        });
    }

    private _getRTCLastPartCopy(details: OfferDetailsModel): string {
        return this._translateService.instant(this._rtcLastParkKey, {
            packageType: this._withoutPlatformNamePipe.transform(this._translateService.instant('app.packageDescriptions.' + details.name + '.name'), details.name),
            term: details.offerTerm,
        });
    }

    private _getRTCRenewalPackagesCopy(rtc: OfferDetailsRTCModel, details: OfferDetailsModel, locale: LangChangeEvent): string[] {
        const packages = this._getRtcPackageList(rtc, 3);
        return packages.map(
            (pkg, index) =>
                (packages.length - 1 === index ? this._translateService.instant(this._rtcORKey) : '') +
                this._translateService.instant(this._rtcPackagesPartKey, {
                    renewalPackageName: this._getRenewalPackageName(pkg.packageName, pkg.parentPackageName),
                    renewalPackageMonthlyPrice: this._getRenewalPackageMonthlyPrice(pkg.pricePerMonth, locale.lang),
                }) +
                (packages.length - 2 > index ? this._translateService.instant(this._rtcUNLESSKey) : '')
        );
    }

    private _getRtcPackageList(rtc: OfferDetailsRTCModel, numberOfOffersToShow: number): any {
        const rtcLength = rtc.renewalPackages.length;
        const packageList = [...rtc.renewalPackages];
        if (rtcLength <= numberOfOffersToShow) {
            return packageList.reverse();
        }
        return packageList.slice(-numberOfOffersToShow).reverse();
    }

    private _getRenewalPackageName(pkgName: string, parentPackageName: string): string {
        const tempPkgName = parentPackageName || pkgName;
        return this._withoutPlatformNamePipe.transform(this._translateService.instant(`app.packageDescriptions.${tempPkgName}.name`), tempPkgName);
    }

    private _getRenewalPackageMonthlyPrice(monthlyPrice: number, lang: string): string {
        return this._currencyPipe.transform(monthlyPrice, 'USD', 'symbol-narrow', this._priceFormat, lang);
    }

    private _getPickAPlan3FOR1PYPFirstPartCopy(): string {
        return this._translateService.instant(this._pickAPlan3FOR1PYPFirstPartKey);
    }

    private _getPickAPlanFirstPartCopy(details: OfferDetailsModel, locale: LangChangeEvent, isQuebec: boolean): string {
        const keyPart = details.type === 'PROMO_MCP' ? '_PROMO_MCP' : '';
        return this._translateService.instant(this._pickAPlanFirstPartKey + keyPart + this._getProvinceKey(isQuebec));
    }

    private _getPickAPlan3FOR1PYPMiddlePartCopy(details: OfferDetailsModel, locale: LangChangeEvent, isQuebec: boolean): string {
        console.log('DETAILS', details);
        return this._translateService.instant(this._pickAPlan3FOR1PYPMiddlePartKey + this._getProvinceKey(isQuebec), {
            term: details.offerTerm,
            monthsPluralized: this._monthMap(details.offerTerm),
            followonStartMonth: details.offerTerm + 1,
            ordinalFollowonStartMonth: this._ordinalNumberToWordMap(+details?.offerTerm + 1),
            offerTotal: this._currencyPipe.transform(details.offerTotal, 'USD', 'symbol-narrow', undefined, locale.lang),
        });
    }

    private _getPickAPlanMiddlePartCopy(details: OfferDetailsModel, locale: LangChangeEvent, isQuebec: boolean): string {
        const keyPart = details.type === 'PROMO_MCP' ? '_PROMO_MCP' : '';
        return this._translateService.instant(this._pickAPlanMiddleParkKey + keyPart + this._getProvinceKey(isQuebec), {
            processingFee: this._currencyPipe.transform(details.processingFee, 'USD', 'symbol-narrow', undefined, locale.lang),
            term: details.offerTerm,
            monthsPluralized: this._monthMap(details.offerTerm),
            followonStartMonth: details.offerTerm + 1,
            offerTotal: this._currencyPipe.transform(details.offerTotal, 'USD', 'symbol-narrow', undefined, locale.lang),
        });
    }

    private _getPickAPlan3FOR1PYPLastPartCopy(details: OfferDetailsModel): string {
        return this._translateService.instant(this._pickAPlan3FOR1PYPLastPartKey, {
            packageType: this._withoutPlatformNamePipe.transform(this._translateService.instant('app.packageDescriptions.' + details.name + '.name'), details.name),
            term: details.offerTerm,
        });
    }

    private _getPickAPlanLastPartCopy(details: OfferDetailsModel, locale: LangChangeEvent, isQuebec: boolean): string {
        const keyPart = details.type === 'PROMO_MCP' ? '_PROMO_MCP' : '';
        return this._translateService.instant(this._pickAPlanLastParkKey + keyPart + this._getProvinceKey(isQuebec), {
            packageType: this._withoutPlatformNamePipe.transform(this._translateService.instant('app.packageDescriptions.' + details.name + '.name'), details.name),
            term: details.offerTerm,
        });
    }

    private _getPickAPlan3FOR1PYPPackagesCopy(pickAPlan3FOR1PYP: OfferDetailsPickAPlanModel): string[] {
        const packages = [...this._getPickAPlan3FOR1PYPPackageList(pickAPlan3FOR1PYP)];
        return packages.reverse().map(
            (pkg, index) =>
                (index === 0 ? '' : packages.length - 1 === index ? this._translateService.instant(this._pickAPlan3FOR1PYPOrKey) : ', ') +
                this._translateService.instant(this._pickAPlan3FOR1PYPPackagesPartKey, {
                    packageName: this._getPackageName(pkg.packageName, pkg.parentPackageName),
                })
        );
    }

    private _getPickAPlanPackagesCopy(pickAPlan: OfferDetailsPickAPlanModel, details: OfferDetailsModel, locale: LangChangeEvent, isQuebec: boolean): string[] {
        const packages = this._getPickAPlanPackageList(pickAPlan, 3);
        return packages.map((pkg, index) => {
            const keyPart = pkg.type === 'PROMO_MCP' ? '_PROMO_MCP' : '';
            return (
                (index === 0 ? '' : packages.length - 1 === index ? this._translateService.instant(this._pickAPlanORKey + keyPart) : ', ') +
                this._translateService.instant(this._pickAPlanPackagesPartKey + keyPart, {
                    packageName: this._getPackageName(pkg.packageName, pkg.parentPackageName),
                    price: pkg.pricePerMonth,
                    termLength: pkg.termLength,
                })
            );
        });
    }

    private _getSelectedOfferPlanDetails(pickAPlan: OfferDetailsPickAPlanModel, selectedOfferName: string, locale: LangChangeEvent, isQuebec: boolean): string[] {
        let hasDefaultChoiceOfferPlan = selectedOfferName?.indexOf('CHOICE') > -1;
        let selectedPackageOffer;

        selectedPackageOffer = this._getPickAPlanPackageList(pickAPlan, 3).filter((offer: any) => offer.packageName.indexOf('CHOICE') > -1)[0];

        if (selectedOfferName && !hasDefaultChoiceOfferPlan) {
            const normalizedPackageName = selectedOfferName.replace(/^(1_|SXM_|3_)/, '');
            selectedPackageOffer = this._getPickAPlanPackageList(pickAPlan, 3).filter((offer: any) => offer.packageName.indexOf(normalizedPackageName) > -1)[0];
        }

        if (selectedPackageOffer) {
            const offerName = this._getPackageName(selectedPackageOffer.packageName, selectedPackageOffer.parentPackageName);
            const keyPart = selectedPackageOffer.type === 'PROMO_MCP' ? '_PROMO_MCP' : '';
            return this._translateService.instant(this._SELECTED_OFFER_DETAILS + keyPart + this._getProvinceKey(isQuebec), {
                offerName: offerName,
                processingFee: this._currencyPipe.transform(selectedPackageOffer.processingFee, 'USD', 'symbol-narrow', undefined, locale.lang),
                offerTerm: selectedPackageOffer.termLength,
                retailRate: this._currencyPipe.transform(selectedPackageOffer.retailPrice, 'USD', 'symbol-narrow', undefined, this._translateService.currentLang),
                price: this._currencyPipe.transform(selectedPackageOffer.price, 'USD', 'symbol-narrow', undefined, this._translateService.currentLang),
            });
        }
    }

    private _getPickAPlan3FOR1PYPRenewalPackagesCopy(pickAPlan3FOR1PYPDetails: OfferDetailsPickAPlanModel, locale: LangChangeEvent, isQuebec: boolean): string[] {
        const packages = [...this._getPickAPlan3FOR1PYPPackageList(pickAPlan3FOR1PYPDetails)];
        return packages.reverse().map(
            (pkg, index) =>
                (index === 0 ? '' : packages.length - 1 === index ? this._translateService.instant(this._pickAPlanORKey) : ', ') +
                this._translateService.instant(this._pickAPlan3FOR1PYPRenewalPackagesPartKey, {
                    packageName: this._getPackageName(pkg.packageName, pkg.parentPackageName),
                    packageMonthlyPrice: this._getPackageMonthlyPrice(pkg.retailPrice, locale.lang, pkg.packageName, isQuebec),
                    msrpPrice: packages[index].msrpPrice,
                })
        );
    }

    private _getPickAPlanRenewalPackagesCopy(pickAPlan: OfferDetailsPickAPlanModel, details: OfferDetailsModel, locale: LangChangeEvent, isQuebec: boolean): string[] {
        const packages = this._getPickAPlanPackageList(pickAPlan, 3);
        return packages.map(
            (pkg, index) =>
                (index === 0 ? '' : packages.length - 1 === index ? this._translateService.instant(this._pickAPlanORKey) : ', ') +
                this._translateService.instant(this._pickAPlanRenewalPackagesPartKey, {
                    packageName: this._getPackageName(pkg.packageName, pkg.parentPackageName),
                    packageMonthlyPrice: this._getPackageMonthlyPrice(pkg.retailPrice, locale.lang, pkg.packageName, isQuebec),
                })
        );
    }

    private _getPickAPlan3FOR1PYPPackageList(pickAPlan: OfferDetailsPickAPlanModel): any {
        return pickAPlan.packages;
    }

    private _getPickAPlanPackageList(pickAPlan: OfferDetailsPickAPlanModel, numberOfOffersToShow: number): any {
        const pickAPlanLength = pickAPlan.packages.length;
        const packageList = [...pickAPlan.packages];
        if (pickAPlanLength <= numberOfOffersToShow) {
            return packageList.reverse();
        }
        return packageList.slice(-numberOfOffersToShow).reverse();
    }

    private _getPackageName(pkgName: string, parentPackageName: string): string {
        const tempPkgName = parentPackageName || pkgName;
        return this._withoutPlatformNamePipe.transform(this._translateService.instant(`app.packageDescriptions.${tempPkgName}.name`), tempPkgName);
    }

    private _getPackageMonthlyPrice(monthlyPrice: number, lang: string, packageName: string, isQuebec: boolean): string {
        if (packageName.includes('SIR_CAN_ALLACCESS')) {
            return this._currencyPipe.transform(isQuebec ? 27.6 : 22.99, 'USD', 'symbol-narrow', this._priceFormat, lang);
        }

        if (packageName.includes('SIR_CAN_EVT')) {
            return this._currencyPipe.transform(isQuebec ? 21.6 : 17.99, 'USD', 'symbol-narrow', this._priceFormat, lang);
        }

        if (packageName.includes('SIR_CAN_CHOICE')) {
            return this._currencyPipe.transform(isQuebec ? 9.59 : 7.99, 'USD', 'symbol-narrow', this._priceFormat, lang);
        }

        return this._currencyPipe.transform(monthlyPrice, 'USD', 'symbol-narrow', this._priceFormat, lang);
    }

    private _updateDealKeys(details: OfferDetailsModel, isQuebec: boolean, isCanada: boolean): string[] {
        const provinceLabel = this._getProvinceKey(isQuebec);
        const {
            name,
            offerTotal,
            offerTerm,
            offerMonthlyRate,
            processingFee,
            savingsPercent,
            etfTerm,
            etf,
            retailRate,
            followOnTermLength,
            followOnPrice,
            packageUpgrade,
            packageUpgradePrice,
            marketType,
        } = details;

        let keyPart = '';
        let dealType = '';

        const isAnnualOffer = details?.offerTerm > 0 && details?.offerTerm % 12 === 0;

        if (!details.isStreaming && details.packageUpgrade && details.type === DealEnum.AMAZON_DOT && !details.etf) {
            dealType = DealEnum.MEGA_WINBACK_AMAZON_DOT;
        } else if (!details.isStreaming && details.packageUpgrade && details.type === DealEnum.APPLE && !details.etf) {
            dealType = DealEnum.MEGA_APPLE;
        } else if (!details.isStreaming && details.packageUpgrade && details.type === 'PROMO_MCP' && !details.etf) {
            dealType = DealEnum.MEGA_LITE;
        } else if (!isCanada && !details.isStreaming && details.type === DealEnum.AMAZON_DOT && details.isMCP) {
            dealType = 'AMZ_DOT_MCP';
        } else if (details.type === DealEnum.GOOGLE_MINI && offerTypeIsSelfPay(details.offerType) && details.isStreaming) {
            dealType = 'GGLE_MINI_FULLPRICE';
        } else if (details.isStudentOffer && details.offerType === 'PROMO_MCP') {
            dealType = 'STUDENT_PROMO_MCP';
        } else if (details.isStudentOffer && details.offerType === 'RTP_OFFER') {
            dealType = 'STUDENT_RTP_OFFER';
        } else if (details.isStreaming && details.offerType === 'RTP_OFFER' && !details.deal) {
            dealType = 'PROMO';
        } else if (details.isAdvantage || offerTypeIsAdvantage(details.offerType) || offerTypeIsAdvantage(details.type)) {
            dealType = 'ADVANTAGE' + (isAnnualOffer ? '_ANNUAL' : '');
        } else {
            // be sure that if details.deal exists, then the dealType gets set to the deal name which is in details.type (for now)
            dealType = details.type;
        }

        if (details.isStreaming) {
            const streamingKey = `${this._dealsKey}.${dealType}${provinceLabel}${'_STREAMING'}`;
            const hasStreamingCopy = this._translateService.instant(streamingKey) !== streamingKey;
            let hasPromoStreamingCopy = false;
            let hasPromoStreamingNoETFCopy = false;
            let hasPromoStreamingTrialCopy = false;

            if (details.deal && !offerTypeIsSelfPay(details.offerType)) {
                if (!details.etf) {
                    const promoStreamingNoETFKey = `${this._dealsKey}.${dealType}${provinceLabel}${'_PROMO_STREAMING_NO_ETF'}`;
                    hasPromoStreamingNoETFCopy = this._translateService.instant(promoStreamingNoETFKey) !== promoStreamingNoETFKey;
                } else if (marketType === 'trial:streaming' && details.offerType === 'RTP_OFFER') {
                    const promoStreamingTrialKey = `${this._dealsKey}.${dealType}${provinceLabel}${'_PROMO_STREAMING_TRIAL'}`;
                    hasPromoStreamingTrialCopy = this._translateService.instant(promoStreamingTrialKey) !== promoStreamingTrialKey;
                } else {
                    const promoStreamingKey = `${this._dealsKey}.${dealType}${provinceLabel}${'_PROMO_STREAMING'}`;
                    hasPromoStreamingCopy = this._translateService.instant(promoStreamingKey) !== promoStreamingKey;
                }
            }

            let hasTrialStreamingCopy = false;
            const trialStreamingCopyKeyPart = '_TRIAL_STREAMING_WITH_CHARGES';
            let hasTrialStudentStreamingWithCharge = false;
            const trialStudentStreamingWithChargeKeyPart = details.deal ? '_TRIAL_STUDENT_RTP_STREAMING_WITH_CHARGES' : '_TRIAL_STREAMING_WITH_CHARGES';
            if (!isCanada && marketType === 'trial:streaming' && details.offerTotal > 0) {
                if (dealType === 'STUDENT_RTP_OFFER') {
                    const trialStudentStreamingWithCharge = `${this._dealsKey}.${dealType}${provinceLabel}${trialStudentStreamingWithChargeKeyPart}`;
                    hasTrialStudentStreamingWithCharge = this._translateService.instant(trialStudentStreamingWithCharge) !== trialStudentStreamingWithCharge;
                } else {
                    const trialStreamingCopy = `${this._dealsKey}.${dealType}${provinceLabel}${trialStreamingCopyKeyPart}`;
                    hasTrialStreamingCopy = this._translateService.instant(trialStreamingCopy) !== trialStreamingCopy;
                }
            }

            if (hasTrialStudentStreamingWithCharge) {
                keyPart = trialStudentStreamingWithChargeKeyPart;
            } else if (hasTrialStreamingCopy) {
                keyPart = trialStreamingCopyKeyPart;
            } else if (dealType === 'STUDENT_RTP_OFFER' && details.offerTotal > 0 && details.deal?.type) {
                dealType = details.deal?.type;
                keyPart = '_STUDENT_RTP_STREAMING_WITH_CHARGES';
            } else if (dealType === 'STUDENT_RTP_OFFER' && details.offerTotal > 0 && !details.deal?.type) {
                keyPart = '_STREAMING_WITH_CHARGES';
            } else if (hasPromoStreamingNoETFCopy) {
                keyPart = '_PROMO_STREAMING_NO_ETF';
            } else if (hasPromoStreamingTrialCopy) {
                keyPart = '_PROMO_STREAMING_TRIAL';
            } else if (hasPromoStreamingCopy) {
                keyPart = '_PROMO_STREAMING';
            } else if (hasStreamingCopy) {
                keyPart = '_STREAMING';
            }
        }

        let deals: string[] = this._translateService.instant(`${this._dealsKey}.${dealType}${provinceLabel}${keyPart}`);
        if (!(deals instanceof Array)) {
            deals = this._translateService.instant(`${this._dealsKey}.DEFAULT${provinceLabel}`);
        }

        const offerUpgrade = this._withoutPlatformNamePipe.transform(this._translateService.instant(`app.packageDescriptions.${packageUpgrade}.name`), packageUpgrade);
        const offerName = details.isStreaming
            ? this._withoutPlatformNameStreamingPipe.transform(this._translateService.instant(`app.packageDescriptions.${name}.name`), name)
            : this._withoutPlatformNamePipe.transform(this._translateService.instant(`app.packageDescriptions.${name}.name`), name);
        const shortPackageNameWithArticle = this._withoutPlatformNameWithArticlePipe.transform(this._translateService.instant(`app.packageDescriptions.${name}.name`), name);
        const platformPlanName: string = this._translateService.instant(`app.packageDescriptions.${name}.name`);
        const offerRetailPrice = isAnnualOffer ? Math.round(retailRate * 12 * 100) / 100.0 : retailRate;
        const offerPrice = isAnnualOffer ? offerTotal : offerMonthlyRate;
        const savingsRate = getOffersSavings(offerRetailPrice, offerPrice);

        return deals.map((value) =>
            this._translateParse.interpolate(value, {
                offerTotal: this._currencyPipe.transform(offerTotal, 'USD', 'symbol-narrow', undefined, this._translateService.currentLang),
                offerTerm,
                followonStartMonth: offerTerm + 1,
                etfTerm,
                etf: this._currencyPipe.transform(etf, 'USD', 'symbol-narrow', undefined, this._translateService.currentLang),
                etfAmount: this._currencyPipe.transform(etf, 'USD', 'symbol-narrow', '1.0-2', this._translateService.currentLang),
                offerRetailPrice: this._currencyPipe.transform(offerRetailPrice, 'USD', 'symbol-narrow', undefined, this._translateService.currentLang),
                retailRate: this._currencyPipe.transform(retailRate, 'USD', 'symbol-narrow', undefined, this._translateService.currentLang),
                retailFutureRate: this._currencyPipe.transform(
                    this._calculateRetailFutureRate(details.name, retailRate),
                    'USD',
                    'symbol-narrow',
                    this._priceFormat,
                    this._translateService.currentLang
                ),
                offerName,
                shortPackageNameWithArticle,
                platformPlanName,
                offerMonthlyRate: this._currencyPipe.transform(offerMonthlyRate, 'USD', 'symbol-narrow', undefined, this._translateService.currentLang),
                savingsPercent: savingsPercent,
                savingsRate: this._currencyPipe.transform(savingsRate, 'USD', 'symbol-narrow', undefined, this._translateService.currentLang),
                processingFee: this._currencyPipe.transform(processingFee, 'USD', 'symbol-narrow', isCanada ? undefined : '1.0', this._translateService.currentLang),
                offerTermPhrase: this._translateOfferTermMap(details, this._translateService),
                priceMonthPhrase: this._translatePriceMonthMap(details, this._translateService, this._currencyPipe),
                followOnTermLength,
                pluralMonthsMap: this._monthMap(details.offerTerm),
                etfPluralMonthsMap: this._monthMap(details.etfTerm),
                monthToWordMap: this._numToWordMap(offerTerm),
                termMap: this._termMap(offerTerm),
                termAdverbMap: this._termMap(offerTerm, true),
                followOnPrice: this._currencyPipe.transform(followOnPrice, 'USD', 'symbol-narrow', '1.2', this._translateService.currentLang),
                offerUpgrade,
                packageUpgradePrice: this._currencyPipe.transform(packageUpgradePrice, 'USD', 'symbol-narrow', undefined, this._translateService.currentLang),
                monthAfterEnd: this._ordinalNumberToWordMap(+offerTerm + 1),
                renewalStartMonth: offerTerm + followOnTermLength + 1,
            })
        );
    }

    private _calculateRetailFutureRate(packageName: string, retailRate: number): number {
        if (packageName.includes('SIR_CAN_EVT')) {
            return 21.6;
        }

        if (packageName.includes('SIR_CAN_ALLACCESS')) {
            return 27.6;
        }

        return retailRate;
    }

    private _translateOfferTermMap(details: OfferDetailsModel, translateService: TranslateService): string {
        const key = `sales-common.OfferDetailsTranslateService.OFFER_TERM_MAP.${details.offerTerm}`;
        const { etfTerm, etf, offerTerm } = details;
        const translation = translateService.instant(key, {
            etfTerm,
            etf: this._currencyPipe.transform(etf, 'USD', 'symbol-narrow', '1.2-2', this._translateService.currentLang),
            offerTerm,
        });
        return translation !== key ? translation : '';
    }

    private _translatePriceMonthMap(details: OfferDetailsModel, translateService: TranslateService, currencyPipe: CurrencyPipe): string {
        let pricingType = 'full';
        if (details.isMCP) {
            pricingType = 'monthly';
        } else if (details.packageUpgrade != null) {
            pricingType = 'megawinback';
        }
        const key = `sales-common.OfferDetailsTranslateService.PRICE_MONTH_MAP.${pricingType}`;
        const translation = translateService.instant(key, {
            offerMonthlyRate: currencyPipe.transform(details.offerMonthlyRate, 'USD', 'symbol-narrow', undefined, translateService.currentLang),
            offerTotal: currencyPipe.transform(details.offerTotal, 'USD', 'symbol-narrow', undefined, translateService.currentLang),
        });
        return translation !== key ? translation : '';
    }

    private _getProvinceKey(isQuebec: boolean): string {
        return isQuebec ? this._provinceKey : '';
    }

    private _monthMap(term: number): string {
        const pluralMonthMap = this._translateService.instant('sales-common.OfferDetailsTranslateService.PLURAL_MAP.MONTH');
        const mappedPluralMonth = this._i18nPluralPipe.transform(term, pluralMonthMap);
        return mappedPluralMonth;
    }

    private _numToWordMap(num: number): string {
        const numToWordMap = this._translateService.instant('sales-common.OfferDetailsTranslateService.NUM_WORDS_MAP.NUMBER');
        const mappedNumWord = this._i18nPluralPipe.transform(num, numToWordMap);
        return mappedNumWord;
    }

    private _ordinalNumberToWordMap(num: number): string {
        const ordinalNumberToWordMap = this._translateService.instant('sales-common.OfferDetailsTranslateService.ORDINAL_NUMBER_WORDS_MAP.NUMBER');
        const mappedOrdinalNumberWord = this._i18nPluralPipe.transform(num, ordinalNumberToWordMap);
        return mappedOrdinalNumberWord;
    }

    private _termMap(offerTerm: number, isAdverb: boolean = false): string {
        const termKey: string = 'sales-common.OfferDetailsTranslateService.PLURAL_MAP.TERM' + (isAdverb ? '_ADVERB' : '');
        const termMap = this._translateService.instant(termKey);
        const mappedTerm = this._i18nPluralPipe.transform(offerTerm, termMap);
        return mappedTerm;
    }

    private _getOfferType(
        offerDetails: OfferDetailsModel,
        rtcDetails: OfferDetailsRTCModel,
        pickAPlanDetails: OfferDetailsPickAPlanModel,
        pickAPlan3FOR1PYPDetails: OfferDetailsPickAPlanModel
    ): OfferDetailsType {
        let type: OfferDetailsType = 'DEFAULT';
        if (offerDetails && offerDetails.deal) {
            type = 'DEFAULT';
        } else if (rtcDetails) {
            type = 'RTC';
        } else if (pickAPlanDetails) {
            type = 'PICKAPLAN';
        } else if (offerDetails && offerTypeIsSelfPay(offerDetails.offerType)) {
            type = 'FULLPRICE';
        } else if (offerDetails?.isAdvantage || offerTypeIsAdvantage(offerDetails?.offerType) || offerTypeIsAdvantage(offerDetails?.type)) {
            type = 'ADVANTAGE';
        } else if (pickAPlan3FOR1PYPDetails?.leadOffer?.promoCode === 'PICK3FOR1') {
            type = 'PICKAPLAN3FOR1PYP';
        }
        return type;
    }

    private _getFullPriceCopy(isQuebec: boolean, isStreaming: boolean, isCanada: boolean, details: OfferDetailsModel, isACSC: boolean): string | boolean {
        if (isCanada) {
            if (details.isStreaming) {
                const { name, retailRate } = details;
                const offerName = this._withoutPlatformNamePipe.transform(this._translateService.instant(`app.packageDescriptions.${name}.name`), name);
                const price = this._currencyPipe.transform(retailRate, 'USD', 'symbol-narrow', undefined, this._translateService.currentLang);
                return this._translateService.instant(this._salesFullPriceKey + this._streamingKey + this._getProvinceKey(isQuebec), { offerName, price });
            } else if (isQuebec) {
                return this._translateService.instant(this._fullPriceKey + this._getProvinceKey(isQuebec));
            } else if (isStreaming) {
                return this._translateService.instant(this._fullPriceKey + this._streamingKey);
            }
        }

        if (!isCanada && isACSC) {
            return this._translateService.instant(this._fullPriceKey + this._ACSCKey);
        }

        return this._translateService.instant(this._fullPriceKey);
    }
}
