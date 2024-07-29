import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import * as Helper from '../helper';
import { Offer } from '@de-care/domains/offers/state-renewals';
import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { VehicleInfo } from '@de-care/domains/account/state-account';
import { getPlatformFromPackageName, PackagePlatformEnum } from '@de-care/domains/offers/state-offers';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyPipe } from '@angular/common';
import { WithoutPlatformNamePipe } from '@de-care/shared/sxm-ui/ui-without-platform-name-pipe';
import { WithoutVehicleMakePipe } from '@de-care/shared/sxm-ui/ui-without-vehicle-make';
import * as uuid from 'uuid/v4';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isAllAccessPackage, isMostlyMusicPackage, isSelectPackage } from '@de-care/data-services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SxmLanguages } from '@de-care/shared/translation';

@Component({
    selector: 'sxm-ui-ac-package-option-card',
    templateUrl: './ac-package-option-card.component.html',
    styleUrls: ['./ac-package-option-card.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AcPackageOptionCardComponent,
            multi: true,
        },
    ],
})
export class AcPackageOptionCardComponent extends ControlValueAccessorConnector implements OnInit, OnDestroy {
    translateKey = 'DeCareUseCasesTransferFeatureACSCTargetedModule.';
    translateKeyUiCommonPrefix = this.translateKey + 'UI_COMMON.';
    translateKeyPrefix = this.translateKey + 'ACPackageOptionCard.';
    comparedOffer: Offer;
    comparedOfferPackageName: string;
    comparedOfferPlanName: string;
    isComparedOfferPromo: boolean;
    @Input() newVehicle: VehicleInfo;
    @Input() offer: Offer;
    @Input() offers: Offer[];
    @Input() endsImmediately: false;
    title: string;
    bodyText: string;
    offerPackageName: string;
    offerPlanName: string;
    locale: string;
    offerTermLength: number;
    isOfferMCP: boolean;
    isOfferRetail: boolean;
    isOfferTrialExt: boolean;
    isOfferFreeTrialExtInCA: boolean;
    offerRetailPrice: number;
    offerPromoPrice: number;
    platform: PackagePlatformEnum;
    controlId: string;
    descriptions: string[];
    isCanada: boolean;
    isQuebec: boolean;
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
        this.isQuebec = this.isCanada && this._userSettingsService.isQuebec();
    }

    setFields() {
        this.offerPackageName = this.offer.packageName;
        this.offerPlanName = this._withoutPlatformName.transform(this._translateService.instant(Helper.getPackageKey(this.offerPackageName)), this.offerPackageName);
        this.offerTermLength = this.offer.termLength;
        this.isOfferMCP = Helper.isOfferMCP(this.offer);
        this.isOfferRetail = Helper.isRetailOffer(this.offer);
        this.offerRetailPrice = this.offer.retailPrice;
        this.platform = getPlatformFromPackageName(this.offerPackageName);
        this.region = `${this.isCanada && !this.isQuebec ? 'ROC_REGION.' : ''}`;
        this.offerPromoPrice = this.offer.pricePerMonth;
        this.isOfferTrialExt = Helper.isOfferTrialExt(this.offer);
        this.isOfferFreeTrialExtInCA = Helper.isOfferTrialExt(this.offer) && this.isCanada && !!this.offer.processingFee && this.offer.price === 0;
    }

    getPackageDescriptions() {
        const packageDetails = this._translateService.instant(`app.packageDescriptions.${this.offerPackageName}`);
        this.details = {
            title: packageDetails?.channels[0]?.title,
            descriptions: packageDetails?.channels[0]?.descriptions || [],
        };
    }

    ngOnInit() {
        this.setFields();
        this.setComparedOfferFields();
        this.setBodyContent();
        this.getPackageDescriptions();
        this._translateService.onLangChange.pipe(takeUntil(this._unsubscribe)).subscribe((ev) => {
            this.locale = ev.lang as SxmLanguages;
            this.setFields();
            this.getPackageDescriptions();
            this.setBodyContent();
        });
    }

    setComparedOfferFields() {
        this.comparedOffer = this.offers.find((offer) => offer.packageName !== this.offer.packageName);
        this.comparedOfferPackageName = this.comparedOffer?.packageName;
        this.comparedOfferPlanName = this._withoutPlatformName.transform(
            this._translateService.instant(Helper.getPackageKey(this.comparedOfferPackageName)),
            this.comparedOfferPackageName
        );
        this.isComparedOfferPromo = !Helper.isRetailOffer(this.comparedOffer);
    }

    setBodyContent() {
        const retailPriceFormatted = this._currencyPipe.transform(this.offerRetailPrice, 'USD', 'symbol-narrow', undefined, this.locale);
        const offerPromoPriceFormatted = this._currencyPipe.transform(this.offerPromoPrice, 'USD', 'symbol-narrow', undefined, this.locale);
        const totalPriceFormatted = this._currencyPipe.transform(this.offer.price, 'USD', 'symbol-narrow', undefined, this.locale);
        const processingFeeFormatted = this._currencyPipe.transform(this.offer.processingFee, 'USD', 'symbol-narrow', undefined, this.locale);
        const translateInterpolations = {
            termLength: this.offerTermLength,
            planName: this.offerPlanName,
            amount: retailPriceFormatted,
            promoAmount: offerPromoPriceFormatted,
            totalAmount: totalPriceFormatted,
            processingFee: processingFeeFormatted,
            pricePerMonth: this._currencyPipe.transform(this.offer.pricePerMonth, 'USD', 'symbol-narrow', undefined, this.locale),
        };
        let suffix: string | null = null;
        if (!this.isOfferRetail) {
            // NOT SELF_PAY
            if (this.isOfferTrialExt) {
                // TRIAL_EXT
                switch (true) {
                    case isAllAccessPackage(this.offerPackageName):
                        if (this.isOfferFreeTrialExtInCA) {
                            suffix = 'FREE_TRIAL_EXT_ALL_ACCESS';
                        } else {
                            suffix = 'TRIAL_EXT_ALL_ACCESS';
                        }
                        break;
                    case isSelectPackage(this.offerPackageName):
                        if (this.isOfferFreeTrialExtInCA) {
                            suffix = 'FREE_TRIAL_EXT_SELECT';
                        } else {
                            suffix = 'TRIAL_EXT_SELECT';
                        }
                        break;
                }
            } else {
                // PROMO
                switch (true) {
                    case isAllAccessPackage(this.offerPackageName):
                        suffix = 'ALL_ACCESS_PROMO';
                        break;
                    case isSelectPackage(this.offerPackageName):
                        if (isAllAccessPackage(this.comparedOfferPackageName) && this.isComparedOfferPromo) {
                            suffix = 'SELECT_PROMO_WHEN_COMPARED_TO_AA_PROMO';
                        } else if (isMostlyMusicPackage(this.comparedOfferPackageName)) {
                            suffix = 'SELECT_PROMO_WHEN_COMPARED_TO_MOSTLY_MUSIC';
                        }
                        break;
                    case isMostlyMusicPackage(this.offerPackageName):
                        suffix = 'MOSTLY_MUSIC_PROMO';
                        break;
                }
            }
        } else {
            // SELF_PAY
            switch (true) {
                case isAllAccessPackage(this.offerPackageName):
                    suffix = 'ALL_ACCESS_RETAIL_PRICE';
                    break;
                case isSelectPackage(this.offerPackageName):
                    if (isAllAccessPackage(this.comparedOfferPackageName) && !this.isComparedOfferPromo) {
                        suffix = 'SELECT_RETAIL_PRICE_WHEN_COMPARED_TO_ALL_ACCESS';
                    } else if (isMostlyMusicPackage(this.comparedOfferPackageName) && !this.isComparedOfferPromo) {
                        suffix = 'SELECT_RETAIL_PRICE_WHEN_COMPARED_TO_MOSTLY_MUSIC';
                    }
                    break;
                case isMostlyMusicPackage(this.offerPackageName):
                    suffix = 'MOSTLY_MUSIC_RETAIL_PRICE';
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

        const key = `${this.translateKeyPrefix}${this.isCanada && !this.isQuebec ? 'ROC_REGION.' : ''}${suffix}`;
        this.bodyText = this._translateService.instant(key, translateInterpolations);
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
}
