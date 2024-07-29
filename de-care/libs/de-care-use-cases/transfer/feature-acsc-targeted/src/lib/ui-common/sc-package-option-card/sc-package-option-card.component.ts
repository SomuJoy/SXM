import { CurrencyPipe } from '@angular/common';
import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isAllAccessFamilyFriendlyPackage, isAllAccessPackage, isMostlyMusicPackage, isSelectPackage, isSelectFamilyFriendlyPackage } from '@de-care/data-services';
import { Subscription, VehicleInfo, ClosedDeviceModel } from '@de-care/domains/account/state-account';
import { getPlatformFromPackageName, PackagePlatformEnum } from '@de-care/domains/offers/state-offers';
import { Offer } from '@de-care/domains/offers/state-renewals';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { WithoutPlatformNamePipe } from '@de-care/shared/sxm-ui/ui-without-platform-name-pipe';
import { WithoutVehicleMakePipe } from '@de-care/shared/sxm-ui/ui-without-vehicle-make';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid/v4';
import * as Helper from '../helper';
import { SxmLanguages } from '@de-care/shared/translation';
import { SettingsService, UserSettingsService } from '@de-care/settings';
@Component({
    selector: 'sxm-ui-sc-package-option-card',
    templateUrl: './sc-package-option-card.component.html',
    styleUrls: ['./sc-package-option-card.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ScPackageOptionCardComponent,
            multi: true,
        },
    ],
})
export class ScPackageOptionCardComponent extends ControlValueAccessorConnector implements OnInit, OnDestroy {
    translateKey = 'DeCareUseCasesTransferFeatureACSCTargetedModule.';
    translateKeyUiCommonPrefix = this.translateKey + 'UI_COMMON.';
    translateKeyPrefix = this.translateKey + 'SCPackageOptionCard.';
    @Input() oldSubscription: Subscription;
    @Input() newVehicle: VehicleInfo;
    @Input() offer: Offer;
    @Input() offers: Offer[];
    @Input() oldClosedRadio: ClosedDeviceModel;
    @Input() isClosedRadio: boolean;
    @Input() isPlatformChangeScenario = false;
    @Input() nonPiiPackageName: string;
    @Input() endsImmediately: false;
    @Input() notToShowPlusFees = false;
    title: string;
    bodyText: string;
    offerPackageName: string;
    oldPackage: string;
    offerPlanName: string;
    oldPlanName: string;
    locale: string;
    offerTermLength: number;
    isOfferMCP: boolean;
    isOfferRetail: boolean;
    isOfferTrialExt: boolean;
    isOfferFreeTrialExtInCA: boolean;
    offerRetailPrice: number;
    offerPricePerMonth: number;
    platform: PackagePlatformEnum;
    controlId: string;
    isCanada: boolean;
    region: string;
    details;
    private _unsubscribe: Subject<void> = new Subject();
    constructor(
        public _translateService: TranslateService,
        public _currencyPipe: CurrencyPipe,
        public _withoutPlatformName: WithoutPlatformNamePipe,
        public _withoutVehicleMake: WithoutVehicleMakePipe,
        injector: Injector,
        private _settingsService: SettingsService,
        private _userSettingsService: UserSettingsService
    ) {
        super(injector);
        this.locale = _translateService.currentLang;
        this.controlId = `option-${uuid()}`;
        this.isCanada = this._settingsService.isCanadaMode;
    }
    setFields() {
        this.offerPackageName = this.offer.packageName;
        this.oldPackage = this.isClosedRadio ? this.oldClosedRadio.subscription.plans[0].packageName : this.oldSubscription.plans[0].packageName;
        this.oldPlanName = this._withoutPlatformName.transform(this._translateService.instant(Helper.getPackageKey(this.oldPackage)), this.oldPackage);
        this.offerPlanName = this._withoutPlatformName.transform(this._translateService.instant(Helper.getPackageKey(this.offerPackageName)), this.offerPackageName);
        this.offerTermLength = this.offer.termLength;
        this.isOfferMCP = Helper.isOfferMCP(this.offer);
        this.isOfferRetail = Helper.isRetailOffer(this.offer);
        this.offerRetailPrice = this.offer.retailPrice;
        this.offerPricePerMonth = this.offer.pricePerMonth;
        this.platform = getPlatformFromPackageName(this.offerPackageName);
        this.region = this.isCanada && !this.notToShowPlusFees ? 'ROC_REGION.' : '';
        this.isOfferTrialExt = Helper.isOfferTrialExt(this.offer);
        this.isOfferFreeTrialExtInCA = Helper.isOfferTrialExt(this.offer) && this.isCanada && !!this.offer.processingFee && this.offer.price === 0;
    }
    ngOnInit() {
        this.setFields();
        this.setCardTitle();
        this.setBodyContent();
        this.getPackageDescriptions();
        this._translateService.onLangChange.pipe(takeUntil(this._unsubscribe)).subscribe((ev) => {
            this.locale = ev.lang as SxmLanguages;
            this.setFields();
            this.getPackageDescriptions();
            this.setCardTitle();
            this.setBodyContent();
        });
    }

    setCardTitle() {
        const prefix = this.translateKeyPrefix + 'TITLE.';
        const oldVehicle = this.isClosedRadio ? this.oldClosedRadio.vehicleInfo : this.oldSubscription.radioService.vehicleInfo;
        let titleSuffix = '';
        const { year: oldVehicleYear, model: oldVehicleModel } = oldVehicle ?? {};
        let oldVehicleMake = oldVehicle.make;
        const isOldVehiclePartialYMM = !oldVehicleMake || !oldVehicleModel || !oldVehicleYear;

        const { year: newVehicleYear, model: newVehicleModel } = this.newVehicle ?? {};
        let newVehicleMake = this.newVehicle.make;
        const isNewVehiclePartialYMM = !newVehicleMake || !newVehicleModel || !newVehicleYear;
        const samePlan = this.offerPlanName === this.oldPlanName;
        const fullPlanName = this._translateService.instant(Helper.getPackageKey(this.offerPackageName));

        if (samePlan) {
            titleSuffix = 'SAME_AS_OLD_CAR_PACKAGE';
        } else if (isAllAccessPackage(this.offer.packageName)) {
            titleSuffix = 'OFFER_IS_ALL_ACCESS';
        } else {
            titleSuffix = 'DEFAULT';
        }

        if (oldVehicleMake && oldVehicleMake === newVehicleMake) {
            oldVehicleMake = newVehicleMake = null;
            if (samePlan ? !isOldVehiclePartialYMM : !isNewVehiclePartialYMM) {
                titleSuffix += '_SAME_MAKE';
            }
        }

        // Overwrite the copy if this a case where the conversion takes affect immediately instead of after the trial ends
        if (this.endsImmediately) {
            titleSuffix = 'BASIC';
        }

        this.title = this._translateService.instant(prefix + titleSuffix, {
            make: this._withoutVehicleMake.transform(samePlan ? oldVehicleMake : newVehicleMake, samePlan),
            planName: samePlan ? this.oldPlanName : this.offerPlanName,
            year: samePlan ? oldVehicleYear : newVehicleYear,
            model: samePlan ? oldVehicleModel : newVehicleModel,
            fullPlanName: fullPlanName,
        });
    }

    getPackageDescriptions() {
        const packageDetails = this._translateService.instant(`app.packageDescriptions.${this.offerPackageName}`);
        this.details = {
            title: packageDetails.channels[0].title,
            descriptions: packageDetails.channels[0].descriptions,
        };
    }
    setBodyContent() {
        this.bodyText = this.getBodyContent();
    }
    getBodyContent() {
        const prefix = this.translateKeyPrefix + 'BODY.';
        const selfPayPackageName = this.oldPackage;
        const offerPlanName = this.offerPlanName;
        const offerPackageName = this.offerPackageName;
        const offerPricePerMonth = this.offer.pricePerMonth;
        const complimentOfferPricePerMonth = this.offers.find((offer) => offer.packageName !== this.offer.packageName)?.pricePerMonth;
        const priceDiff = offerPricePerMonth - complimentOfferPricePerMonth;
        const priceDiffFormatted = this._currencyPipe.transform(priceDiff, 'USD', 'symbol-narrow', undefined, this.locale);
        const translateInterpolations = {
            planName: offerPlanName,
            amount: priceDiffFormatted,
            pricePerMonth: this._currencyPipe.transform(offerPricePerMonth, 'USD', 'symbol-narrow', undefined, this.locale),
            termLength: this.offer.termLength,
            totalPrice: this._currencyPipe.transform(this.offer.price, 'USD', 'symbol-narrow', undefined, this.locale),
        };
        let suffix: string | null = null;
        const CONTAINS_PRICE_DIFF_KEYS = [
            'RETAIL_PRICE_PLANS_AND_SELF_PAY_SELECT-ALL_ACCESS',
            'RETAIL_PRICE_PLANS_AND_SELF_PAY_SELECT_FF-ALL_ACCESS',
            'RETAIL_PRICE_PLANS_AND_SELF_PAY_MOSTLY_MUSIC-SELECT',
        ];

        if (isAllAccessPackage(this.offerPackageName) && this.isPlatformChangeScenario) {
            suffix = 'PLATFORM_CHANGE_SCENARIO-ALL_ACCESS';
        } else {
            if (Helper.isRetailOffers(this.offers)) {
                switch (true) {
                    case isAllAccessFamilyFriendlyPackage(selfPayPackageName):
                        if (isAllAccessPackage(offerPackageName)) {
                            suffix = 'RETAIL_PRICE_PLANS_AND_SELF_PAY_ALL_ACCESS_FF-ALL_ACCESS';
                        } else if (isSelectPackage(offerPackageName)) {
                            suffix = 'RETAIL_PRICE_PLANS_AND_SELF_PAY_ALL_ACCESS_FF-SELECT';
                        }
                        break;
                    case isSelectPackage(selfPayPackageName):
                        if (isAllAccessPackage(offerPackageName)) {
                            suffix = 'RETAIL_PRICE_PLANS_AND_SELF_PAY_SELECT-ALL_ACCESS';
                        } else if (isSelectPackage(offerPackageName)) {
                            suffix = 'RETAIL_PRICE_PLANS_AND_SELF_PAY_SELECT-SELECT';
                        }
                        break;
                    case isSelectFamilyFriendlyPackage(selfPayPackageName):
                        if (isAllAccessPackage(offerPackageName)) {
                            suffix = 'RETAIL_PRICE_PLANS_AND_SELF_PAY_SELECT_FF-ALL_ACCESS';
                        } else if (isSelectPackage(offerPackageName)) {
                            suffix = 'RETAIL_PRICE_PLANS_AND_SELF_PAY_SELECT_FF-SELECT';
                        }
                        break;
                    case isMostlyMusicPackage(selfPayPackageName):
                        if (isAllAccessPackage(offerPackageName)) {
                            suffix = 'RETAIL_PRICE_PLANS_AND_SELF_PAY_MOSTLY_MUSIC-ALL_ACCESS';
                        } else if (isSelectPackage(offerPackageName)) {
                            suffix = 'RETAIL_PRICE_PLANS_AND_SELF_PAY_MOSTLY_MUSIC-SELECT';
                        }
                        break;
                }
            } else if (Helper.hasAllAccessAndSelectPromos(this.offers)) {
                switch (true) {
                    case isAllAccessPackage(offerPackageName):
                        if (isAllAccessPackage(selfPayPackageName)) {
                            suffix = 'ALL_ACCESS_AND_SELECT_PROMOS_AND_SELF_PAY_ALL_ACCESS-ALL_ACCESS';
                        } else {
                            suffix = 'ALL_ACCESS_AND_SELECT_PROMOS_AND_SELF_PAY_NOT_ALL_ACCESS-ALL_ACCESS';
                        }
                        break;
                    case isSelectPackage(offerPackageName):
                        suffix = 'ALL_ACCESS_AND_SELECT_PROMOS_AND_SELF_PAY_ALL_ACCESS-SELECT';
                        break;
                }
            } else if (Helper.hasSelectPromoAndMostlyMusicRetailPlan(this.offers)) {
                switch (true) {
                    case isSelectPackage(offerPackageName):
                        suffix = 'SELECT_PROMO_AND_MOSTLY_MUSIC_RETAIL_PRICE-SELECT';
                        break;
                    case isMostlyMusicPackage(offerPackageName):
                        suffix = 'SELECT_PROMO_AND_MOSTLY_MUSIC_RETAIL_PRICE-MOSTLY_MUSIC';
                        break;
                }
            }
        }

        if (!suffix || (CONTAINS_PRICE_DIFF_KEYS.includes(suffix) && priceDiff < 0)) {
            switch (true) {
                case isAllAccessPackage(offerPackageName):
                    suffix = 'FALLBACK_ALL_ACCESS';
                    break;
                case isSelectPackage(offerPackageName):
                    suffix = 'FALLBACK_SELECT';
                    break;
                case isMostlyMusicPackage(offerPackageName):
                    suffix = 'FALLBACK_MOSTLY_MUSIC';
                    break;
            }
        }

        // Overwrite the copy if this a case where the conversion takes affect immediately instead of after the trial ends
        if (this.endsImmediately) {
            switch (this.offer.type) {
                case 'PROMO':
                case 'PROMO_MCP': {
                    suffix = 'BASIC_PROMO';
                    break;
                }
                case 'TRIAL_EXT': {
                    suffix = 'BASIC_TRIAL_EXTENSION';
                    break;
                }
                default: {
                    suffix = 'BASIC';
                }
            }
        }

        const key = `${prefix}${this.region}${suffix}`;
        return this._translateService.instant(key, translateInterpolations);
    }

    isPackageSelect(packageName: string) {
        return isSelectPackage(packageName);
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
}
