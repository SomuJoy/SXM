import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PlanTypeEnum, PackagePlatformEnum, VehicleModel, DataAccountService, OfferCustomerDataModel, OfferDetailsModel, PackageModel } from '@de-care/data-services';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { timer, Subject, Observable } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { PlanDetails } from '../platform-upgrade-option/platform-upgrade-option.component';

export interface PlatformChangeInfo {
    currentSubscription: CurrentSubscription;
    platformChangePlan: PlatformChangePlan;
}

export interface CurrentSubscription {
    plans: CurrentPlan[];
    radio: Radio;
}

export interface Radio {
    vehicleInfo: VehicleModel;
}

export interface CurrentPlan {
    type: PlanTypeEnum;
    endDate: string;
    packageName: string;
}

export interface PlatformChangePlan {
    platform: PackagePlatformEnum;
    packageName: string;
    leadOfferPackageName: string;
    offerType?: string;
    dealType?: string;
    termLength?: number;
}

export interface RequestModalPayload {
    details: PlanDetails;
    package: PackageModel;
}

export interface PlatformChangeAcceptance {
    deferredUpsell: boolean;
}

@Component({
    selector: 'different-platform',
    templateUrl: './different-platform.component.html',
    styleUrls: ['different-platform.component.scss'],
})
export class DifferentPlatformComponent implements OnInit {
    @Input() set platformChangeInfo(value: PlatformChangeInfo) {
        this._reset();
        if (value) {
            this.radio = value.currentSubscription.radio;
            if (this.radio && this.radio.vehicleInfo) {
                this._dataAccount.sanitizeVehicleInfo(this.radio.vehicleInfo);
            }
            this.currentSubscription = value.currentSubscription;
            this.platformChangePlan = value.platformChangePlan;
            this.displayVehicleSection = this.checkVehicleDisplay(this.radio, this.currentSubscription);
            this.loaded.emit();
        }
    }
    @Output() accepted = new EventEmitter<PlatformChangeAcceptance>();
    @Output() loaded = new EventEmitter();

    offerRequest: OfferCustomerDataModel;
    radio: Radio = null;
    currentSubscription: CurrentSubscription = null;
    platformChangePlan: PlatformChangePlan = null;
    trialPlanType = PlanTypeEnum.Trial;
    isCanadaMode: boolean;
    timer$: Observable<number>;
    dateFormat$: Observable<string>;
    locale: string;
    timeZone: string;
    excludedChannels: any;
    offerDetails: OfferDetailsModel;
    displayVehicleSection = false;
    shouldDeferUpsell = true;
    _packageUpgradeOffer: PackageModel;
    private _unsubscribe: Subject<void> = new Subject();

    constructor(
        private _settingsService: SettingsService,
        private _translateService: TranslateService,
        private _dataAccount: DataAccountService,
        private readonly _userSettingsService: UserSettingsService
    ) {
        this.dateFormat$ = this._userSettingsService.dateFormat$;
        this.locale = _translateService.currentLang;
        this.timeZone = null;
    }

    ngOnInit() {
        this.isCanadaMode = this._settingsService.isCanadaMode;
        this.timer$ = timer(3000);
        this._getExcludedPackageDescriptions();
        this._listenForLangChange();
    }

    private _reset(): void {
        this.radio = null;
        this.platformChangePlan = null;
        this.offerRequest = null;
        this.currentSubscription = null;
    }

    private _listenForLangChange(): void {
        this._translateService.onLangChange.pipe(takeUntil(this._unsubscribe)).subscribe((changes: LangChangeEvent) => {
            this.locale = changes.lang;
            this._getExcludedPackageDescriptions();
        });
    }

    private _getExcludedPackageDescriptions(): void {
        if (this.platformChangePlan && this.platformChangePlan.leadOfferPackageName) {
            const leadOfferPackageDescription = this._translateService.instant(`app.packageDescriptions.${this.platformChangePlan.leadOfferPackageName}`);
            if (leadOfferPackageDescription && leadOfferPackageDescription.packageDiff && leadOfferPackageDescription.packageDiff.length > 0) {
                const excluded = leadOfferPackageDescription.packageDiff.find((i) => i.packageName === this.platformChangePlan.packageName);
                if (excluded && excluded.excludedChannels) {
                    this.excludedChannels = excluded.excludedChannels;
                }
            }
        }
    }

    checkVehicleDisplay(radio: Radio, currentSubscription: CurrentSubscription): boolean {
        return (
            (radio && radio.vehicleInfo && (!!radio.vehicleInfo.model || !!radio.vehicleInfo.make || !!radio.vehicleInfo.year)) ||
            (currentSubscription && currentSubscription.plans && currentSubscription.plans.length > 0)
        );
    }

    acceptClicked() {
        this.accepted.emit({
            deferredUpsell: this.shouldDeferUpsell,
        });
    }
}
