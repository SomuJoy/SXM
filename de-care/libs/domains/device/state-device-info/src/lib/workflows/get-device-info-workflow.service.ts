import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DeviceInfoService } from './../data-services/device-info.service';
import { behaviorEventReactionDevicePromoCode } from '@de-care/shared/state-behavior-events';

export interface DeviceInfo {
    radioId: string;
    deviceStatus: string;
    primaryBrandId?: string;
    primaryDealerId?: string;
    secondaryBrandId?: string;
    secondaryDealerId?: string;
    vehicle?: {
        readonly id?: number | string;
        year: string | number;
        make: string;
        model: string;
        vin?: string;
    };
    service?: string;
    promoCode?: string;
}

@Injectable({ providedIn: 'root' })
export class GetDeviceInfoWorkflowService implements DataWorkflow<string, DeviceInfo> {
    constructor(private readonly _deviceInfoService: DeviceInfoService, private readonly _store: Store) {}

    build(radioID: string): Observable<DeviceInfo> {
        return this._deviceInfoService.getDeviceInfo({ radioId: radioID }).pipe(
            tap((data) => {
                if (data?.deviceInformation?.promoCode) {
                    this._store.dispatch(behaviorEventReactionDevicePromoCode({ devicePromoCode: data.deviceInformation.promoCode }));
                }
            }),
            map(({ deviceInformation }) => deviceInformation)
        );
    }
}
