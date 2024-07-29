import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DeviceInfoService } from './../data-services/device-info.service';
import { loadDeviceInfoDataError, setDeviceInfoData } from './../state/actions';
import { behaviorEventReactionDevicePromoCode } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class DeviceInfoWorkflow implements DataWorkflow<string, boolean> {
    constructor(private readonly _deviceInfoService: DeviceInfoService, private readonly _store: Store) {}

    build(radioID: string): Observable<boolean> {
        return this._deviceInfoService.getDeviceInfo({ radioId: radioID }).pipe(
            tap(data => this._store.dispatch(setDeviceInfoData(data))),
            tap(
                data =>
                    !!data?.deviceInformation?.promoCode && this._store.dispatch(behaviorEventReactionDevicePromoCode({ devicePromoCode: data.deviceInformation.promoCode }))
            ),
            catchError(error => {
                this._store.dispatch(loadDeviceInfoDataError());
                return throwError(error);
            }),
            map(() => true)
        );
    }
}
