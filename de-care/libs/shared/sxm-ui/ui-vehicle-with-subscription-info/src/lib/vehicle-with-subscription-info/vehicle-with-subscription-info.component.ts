import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserSettingsService } from '@de-care/settings';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SxmLanguages } from '@de-care/shared/translation';

export interface VehicleModel {
    readonly id?: number | string;
    year: string | number;
    make: string;
    model: string;
    vin?: string;
}

export interface VehicleWithSubscriptionInterface {
    vehicle: VehicleModel;
    radioId?: string;
    packageName: string;
    endDate?: string;
    startDate?: string;
    renewalDate?: string;
    isLifetime?: boolean;
    username?: string;
    isTrialRadio: boolean;
    isSelfPay: boolean;
    showIcon: boolean;
    termLength?: number;
    isPromo?: boolean;
    isSelfPayClosed?: boolean;
    isYmmIdentical?: boolean;
    multiplePlans?: { packageName: string; termLength: number; isPromo: boolean }[];
}

@Component({
    selector: 'sxm-ui-vehicle-with-subscription-info',
    templateUrl: './vehicle-with-subscription-info.component.html',
    styleUrls: ['./vehicle-with-subscription-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleWithSubscriptionInfoComponent implements OnInit, OnDestroy {
    @Input() data: VehicleWithSubscriptionInterface;
    @Input() eyebrow: string;
    @Input() displayPackageNameAsTitle = false;
    @Input() footer = '';
    translateKeyPrefix = 'sharedSxmUiUiVehicleWithSubscriptionInfoModule.vehicleWithSubscriptionInfoComponent.';
    dateFormat$: Observable<string> = this._userSettingsService.dateFormat$;
    locale: string;
    timeZone: string;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private _translateService: TranslateService, private _userSettingsService: UserSettingsService) {
        this.locale = _translateService.currentLang;
        this.timeZone = null;
    }

    ngOnInit() {
        this._translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((ev) => {
            this.locale = ev.lang as SxmLanguages;
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
