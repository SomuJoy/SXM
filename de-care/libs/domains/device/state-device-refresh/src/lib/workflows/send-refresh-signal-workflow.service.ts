import { Injectable } from '@angular/core';
import { behaviorEventReactionRefreshSignalBySignal } from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataDevicesService } from '../data-services/data-devices.service';
import { RefreshRequestInterface } from '../data-services/refresh-request.interface';

@Injectable({
    providedIn: 'root'
})
export class SendRefreshSignalWorkflowService implements DataWorkflow<RefreshRequestInterface, any> {
    constructor(private _dataDeviceService: DataDevicesService, private _store: Store) {}

    build(refreshRequest: RefreshRequestInterface): Observable<any> {
        return this._dataDeviceService.refresh(refreshRequest).pipe(tap(_ => this._store.dispatch(behaviorEventReactionRefreshSignalBySignal())));
    }
}
