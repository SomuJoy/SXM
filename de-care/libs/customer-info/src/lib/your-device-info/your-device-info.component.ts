import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PlanTypeEnum, VehicleModel, PlanModel, sanitizeVehicleInfo } from '@de-care/data-services';
import { UserSettingsService } from '@de-care/settings';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

export interface YourDeviceInfo {
    vehicleInfo: VehicleModel;
    plans: PlanModel[];
    closedDate?: string;
}

@Component({
    selector: 'your-device-info',
    templateUrl: './your-device-info.component.html',
    styleUrls: ['./your-device-info.component.scss']
})
export class YourDeviceInfoComponent implements OnInit, OnDestroy {
    @Input() set data(yourDeviceInfo: YourDeviceInfo) {
        if (!!yourDeviceInfo) {
            this.vehicleInfo = yourDeviceInfo.vehicleInfo;
            sanitizeVehicleInfo(this.vehicleInfo);
            this.plans = yourDeviceInfo.plans;
            if (this.plans) {
                this.expires = true;
                this.closed = false;
            } else if (yourDeviceInfo.closedDate) {
                this.isClosedRadio = true;
                this.closed = true;
                this.expires = false;
                this.endDate = yourDeviceInfo.closedDate;
            }
        }
    }
    vehicleInfo: VehicleModel;
    plans: PlanModel[];
    endDate: string;
    closed: boolean;
    expires: boolean;
    isClosedRadio: boolean;
    dateFormat$: Observable<string>;
    locale: string;
    timeZone: string;
    private _unsubscribe: Subject<void> = new Subject();

    constructor(private _translateService: TranslateService, private _userSettingsService: UserSettingsService) {
        this.dateFormat$ = _userSettingsService.dateFormat$;
        this.locale = _translateService.currentLang;
        this.timeZone = null;
    }

    ngOnInit() {
        this._listenForLocale();
    }

    private _listenForLocale(): void {
        this._translateService.onLangChange.pipe(takeUntil(this._unsubscribe)).subscribe((changes: LangChangeEvent) => {
            this.locale = changes.lang;
        });
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
}
