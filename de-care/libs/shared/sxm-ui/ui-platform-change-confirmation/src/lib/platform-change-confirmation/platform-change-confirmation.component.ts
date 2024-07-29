import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PlanTypeEnum, VehicleModel } from '@de-care/data-services';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { CommonModule } from '@angular/common';

export interface PlatformChangeAcceptance {
    deferredUpsell: boolean;
}

export interface CurrentPlan {
    type: PlanTypeEnum;
    endDate: string;
    packageName: string;
}

export interface Radio {
    vehicleInfo: VehicleModel;
}

interface CurrentSubscription {
    plans: CurrentPlan[];
    radio: Radio;
}

enum PackagePlatformEnum {
    Xm = 'XM',
    Siriusxm = 'SiriusXM',
    Sirius = 'SIRIUS',
}

interface PlatformChangePlan {
    platform: PackagePlatformEnum;
    packageName: string;
    leadOfferPackageName: string;
    offerType?: string;
    dealType?: string;
    termLength?: number;
}

export interface PlatformChangeInfo {
    currentSubscription: CurrentSubscription;
    platformChangePlan: PlatformChangePlan;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-platform-change-confirmation',
    templateUrl: './platform-change-confirmation.component.html',
    styleUrls: ['./platform-change-confirmation.component.scss'],
    standalone: true,
    imports: [CommonModule, TranslateModule],
})
export class SxmUiPlatformChangeConfirmationComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    excludedChannels: any;
    platformChangePlan: any;
    shouldDeferUpsell = true;
    constructor(readonly translationsForComponentService: TranslationsForComponentService, private readonly _translateService: TranslateService) {
        translationsForComponentService.init(this);
    }
    @Input() set platformChangeInfo(value: PlatformChangeInfo) {
        this._reset();
        if (value) {
            this.platformChangePlan = value.platformChangePlan;
            this.loaded.emit();
        }
    }
    @Output() accepted = new EventEmitter<PlatformChangeAcceptance>();
    @Output() loaded = new EventEmitter();

    ngOnInit() {
        this._getExcludedPackageDescriptions();
    }

    private _reset(): void {
        this.platformChangePlan = null;
    }

    private _getExcludedPackageDescriptions(): void {
        if (this.platformChangePlan && this.platformChangePlan?.leadOfferPackageName) {
            const leadOfferPackageDescription = this._translateService.instant(`app.packageDescriptions.${this.platformChangePlan.leadOfferPackageName}`);
            if (leadOfferPackageDescription && leadOfferPackageDescription.packageDiff && leadOfferPackageDescription.packageDiff.length > 0) {
                const excluded = leadOfferPackageDescription.packageDiff.find((i) => i.packageName === this.platformChangePlan.packageName);
                if (excluded && excluded.excludedChannels) {
                    this.excludedChannels = excluded.excludedChannels;
                }
            }
        }
    }

    acceptClicked() {
        this.accepted.emit({
            deferredUpsell: this.shouldDeferUpsell,
        });
    }
}
