import { Injectable } from '@angular/core';
import { SendRefreshSignalWorkflowService } from '@de-care/domains/device/state-device-refresh';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { RefreshRequestInterface } from './refresh-request.interface';

@Injectable({
    providedIn: 'root'
})
export class RefreshSignalWorkflowService implements DataWorkflow<RefreshRequestInterface, any> {
    constructor(private _sendRefreshSignalWorkflowService: SendRefreshSignalWorkflowService) {}

    build(refreshRequest: RefreshRequestInterface): Observable<any> {
        return this._sendRefreshSignalWorkflowService.build(refreshRequest);
    }
}
