import { Injectable } from '@angular/core';
import { SendTextInstructionsWorkflowService } from '@de-care/domains/device/state-device-refresh';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { RefreshRequestInterface } from './refresh-request.interface';

@Injectable({
    providedIn: 'root'
})
export class TextInstructionsWorkflowService implements DataWorkflow<RefreshRequestInterface, any> {
    constructor(private sendTextInstructionsWorkflowService: SendTextInstructionsWorkflowService) {}

    build(refreshRequest: RefreshRequestInterface): Observable<any> {
        return this.sendTextInstructionsWorkflowService.build(refreshRequest);
    }
}
