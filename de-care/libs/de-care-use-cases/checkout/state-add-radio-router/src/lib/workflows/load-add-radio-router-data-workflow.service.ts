import { Injectable } from '@angular/core';
import { CustomerFlepzLookupWorkflowService, getClosedOrInactiveRadioDevicesAsArray } from '@de-care/domains/identity/state-flepz-lookup';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, take, withLatestFrom } from 'rxjs/operators';
import { getAccountRequestData } from '../state/selectors';
import { ConfigureAddRadioRouterDataWorkflowService } from './configure-add-radio-router-data-workflow.service';

export type LoadAddRadioRouterDataWorkflowServiceResult = 'DEVICES_AVAILABLE' | 'DEVICES_NOT_FOUND';
export type LoadAddRadioRouterDataWorkflowServiceErrors = 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class LoadAddRadioRouterDataWorkflowService implements DataWorkflow<void, LoadAddRadioRouterDataWorkflowServiceResult> {
    constructor(
        private readonly _store: Store,
        private readonly _customerFlepzLookupWorkflowService: CustomerFlepzLookupWorkflowService,
        private readonly _configureAddRadioRouterDataWorkflowService: ConfigureAddRadioRouterDataWorkflowService
    ) {}

    private _loadDevices$ = this._configureAddRadioRouterDataWorkflowService.build().pipe(
        withLatestFrom(this._store.select(getAccountRequestData)),
        concatMap(([, request]) => this._customerFlepzLookupWorkflowService.build({ ...request })),
        withLatestFrom(this._store.select(getClosedOrInactiveRadioDevicesAsArray)),
        map(([, devices]) => {
            if (devices.length > 0) {
                return 'DEVICES_AVAILABLE' as LoadAddRadioRouterDataWorkflowServiceResult;
            } else {
                return 'DEVICES_NOT_FOUND' as LoadAddRadioRouterDataWorkflowServiceResult;
            }
        })
    );

    build(): Observable<LoadAddRadioRouterDataWorkflowServiceResult> {
        return this._loadDevices$.pipe(catchError(() => throwError('SYSTEM' as LoadAddRadioRouterDataWorkflowServiceErrors)));
    }
}
