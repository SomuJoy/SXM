import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError, of } from 'rxjs';
import { DeviceValidateService, DeviceValidateRequestModel } from '../data-services/device-validate.service';
import { Store } from '@ngrx/store';
import { catchError, tap, mapTo } from 'rxjs/operators';

export interface WorkflowRequest {
    radioId: string;
}

@Injectable({ providedIn: 'root' })
export class ValidateDeviceWorkflowService implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(private _deviceValidateService: DeviceValidateService, private _store: Store) {}

    build(request: WorkflowRequest): Observable<boolean> {
        return this._hasFullRadioId(request) 
                ? this._deviceValidateService.validate(request, false).pipe(
                     mapTo(true))
                : of(true);
    }
    
    private _hasFullRadioId(request: WorkflowRequest) {
        return request.radioId && request.radioId.length > 4;
    }
}
