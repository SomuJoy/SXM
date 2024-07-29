import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerFlepzLookupWorkflowService, getClosedOrInactiveRadioDevicesAsArray } from '@de-care/domains/identity/state-flepz-lookup';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, take, withLatestFrom } from 'rxjs/operators';
import { setSelectedUpsellPlanCode, setSubscriptionIdToChangeFrom } from '../state/actions';
import { setSelectedRadioId } from '../state/public.actions';
import { getAccountRequestData, getOfferWasLoaded } from '../state/selectors';

export type LoadSatelliteChangeToDataWorkflowServiceResult = 'DEVICES_AVAILABLE' | 'DEVICES_NOT_FOUND';
export type LoadSatelliteChangeToDataWorkflowServiceErrors = 'SYSTEM' | 'OFFER_NOT_LOADED';

@Injectable({ providedIn: 'root' })
export class LoadSatelliteChangeToDataWorkflowService implements DataWorkflow<void, LoadSatelliteChangeToDataWorkflowServiceResult> {
    constructor(private readonly _store: Store, private readonly _router: Router, private readonly _customerFlepzLookupWorkflowService: CustomerFlepzLookupWorkflowService) {}

    private _checkOffers$ = this._store.select(getOfferWasLoaded).pipe(
        map((offerWasLoaded) => {
            if (!offerWasLoaded) {
                throw new Error('OFFER_NOT_LOADED' as LoadSatelliteChangeToDataWorkflowServiceErrors);
            }
            return true;
        })
    );

    private _loadDevices$ = this._store.select(getAccountRequestData).pipe(
        take(1),
        concatMap((request) => this._customerFlepzLookupWorkflowService.build({ ...request })),
        withLatestFrom(this._store.select(getClosedOrInactiveRadioDevicesAsArray)),
        map(([, devices]) => {
            if (devices.length > 0) {
                return 'DEVICES_AVAILABLE' as LoadSatelliteChangeToDataWorkflowServiceResult;
            } else {
                return 'DEVICES_NOT_FOUND' as LoadSatelliteChangeToDataWorkflowServiceResult;
            }
        })
    );

    build(): Observable<LoadSatelliteChangeToDataWorkflowServiceResult> {
        const routerStateData = this._router.getCurrentNavigation()?.extras?.state;

        if (routerStateData?.subscriptionId && routerStateData?.planCode) {
            this._store.dispatch(setSubscriptionIdToChangeFrom({ subscriptionIdToChangeFrom: routerStateData?.subscriptionId }));
            this._store.dispatch(setSelectedUpsellPlanCode({ planCode: routerStateData?.planCode }));
        } else {
            return throwError('SYSTEM' as LoadSatelliteChangeToDataWorkflowServiceErrors);
        }
        return this._checkOffers$.pipe(
            concatMap(() => this._loadDevices$),
            catchError(() => throwError('SYSTEM' as LoadSatelliteChangeToDataWorkflowServiceErrors))
        );
    }
}
