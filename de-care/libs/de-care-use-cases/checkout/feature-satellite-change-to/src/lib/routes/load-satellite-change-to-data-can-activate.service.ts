import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { LoadSatelliteChangeToDataWorkflowService, LoadSatelliteChangeToDataWorkflowServiceResult } from '@de-care/de-care-use-cases/checkout/state-satellite-change-to';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class LoadSatelliteChangeToDataCanActivateService implements CanActivate {
    constructor(private readonly _loadSatelliteChangeToDataWorkflowService: LoadSatelliteChangeToDataWorkflowService, private readonly _router: Router) {}

    canActivate(): Observable<UrlTree> {
        return this._loadSatelliteChangeToDataWorkflowService.build().pipe(
            map((result: LoadSatelliteChangeToDataWorkflowServiceResult) => {
                if (result === 'DEVICES_AVAILABLE') {
                    return this._router.createUrlTree(['/subscribe/checkout/purchase/satellite/change-to/device-select']);
                } else {
                    return this._router.createUrlTree(['/subscribe/checkout/purchase/satellite/change-to/device-lookup']);
                }
            }),
            catchError(() => of(this._router.createUrlTree(['/error'])))
        );
    }
}
