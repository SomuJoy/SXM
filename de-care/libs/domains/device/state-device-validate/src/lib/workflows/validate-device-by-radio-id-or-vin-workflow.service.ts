import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { radioIdLike, vinLike } from '../constants';
import { RadioModel } from '../data-services/device-validate.service';
import { Store } from '@ngrx/store';
import { ValidateDeviceByRadioIdWorkflowService } from './validate-device-by-radio-id-workflow.service';
import { ValidateDeviceByVinWorkflowService } from './validate-device-by-vin-workflow.service';

interface WorkflowRequest {
    identifier: string;
}

@Injectable({ providedIn: 'root' })
export class ValidateDeviceByRadioIdOrVinWorkflowService implements DataWorkflow<WorkflowRequest, RadioModel> {
    constructor(
        private readonly _validateDeviceByRadioIdWorkflowService: ValidateDeviceByRadioIdWorkflowService,
        private readonly _validateDeviceByVinWorkflowService: ValidateDeviceByVinWorkflowService,
        private readonly _store: Store
    ) {}

    build({ identifier }: WorkflowRequest): Observable<RadioModel> {
        if (radioIdLike.test(identifier)) {
            return this._validateDeviceByRadioIdWorkflowService.build(identifier);
        } else if (vinLike.test(identifier)) {
            return this._validateDeviceByVinWorkflowService.build(identifier);
        } else {
            return throwError('Invalid identifier submitted');
        }
    }
}
