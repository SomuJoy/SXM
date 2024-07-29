import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { UrlHelperService } from '@de-care/app-common';
import { DataDevicesService, VehicleModel, DataDeviceInfoModel } from '@de-care/data-services';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { behaviorEventReactionDevicePromoCode } from '@de-care/shared/state-behavior-events';

@Injectable()
export class VehicleInfoResolver implements Resolve<Observable<VehicleModel>> {
    constructor(private _urlHelperService: UrlHelperService, private _dataDevicesService: DataDevicesService, private readonly _store: Store) {}

    resolve(route: ActivatedRouteSnapshot): Observable<VehicleModel> {
        const radioId: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'radioid');

        if (radioId) {
            return this._dataDevicesService.info({ radioId }).pipe(
                tap(
                    result =>
                        result.deviceInformation.promoCode &&
                        this._store.dispatch(behaviorEventReactionDevicePromoCode({ devicePromoCode: result.deviceInformation.promoCode }))
                ),
                map((result: DataDeviceInfoModel) => {
                    return result && result.deviceInformation && result.deviceInformation.vehicle ? (result.deviceInformation.vehicle as VehicleModel) : null;
                }),
                catchError(() => of(null))
            );
        } else {
            return of(null);
        }
    }
}
