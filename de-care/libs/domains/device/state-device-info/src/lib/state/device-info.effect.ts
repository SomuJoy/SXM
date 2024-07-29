import { map, switchMap } from 'rxjs/operators';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { getDeviceInfo, setDeviceInfoData } from './actions';
import { DeviceInfoService } from '../data-services/device-info.service';

@Injectable()
export class DeviceInfoEffects {
    constructor(private readonly _actions$: Actions, private readonly _deviceInfoService: DeviceInfoService) {}

    getDeviceInfo$ = createEffect(() =>
        this._actions$.pipe(
            ofType(getDeviceInfo),
            switchMap(({ radioId }) => this._deviceInfoService.getDeviceInfo({ radioId }).pipe(map(data => setDeviceInfoData(data))))
        )
    );
}
