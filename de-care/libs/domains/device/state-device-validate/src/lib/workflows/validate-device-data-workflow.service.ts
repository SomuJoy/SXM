import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RadioModel } from '../data-services/device-validate.service';
import { ValidateDeviceByLicensePlateDataWorkflowService } from './validate-device-by-license-plate-data-workflow.service';
import { ValidateDeviceByRadioIdWorkflowService } from './validate-device-by-radio-id-workflow.service';
import { ValidateDeviceByVinWorkflowService } from './validate-device-by-vin-workflow.service';

type LookupType = 'radioId' | 'vin' | 'licensePlate';

interface LicensePlateIdentifier {
    licensePlate: string;
    state: string;
}

export interface DeviceDataRequest {
    lookupType: LookupType;
    identifier?: string | LicensePlateIdentifier;
}

export type ValidateDeviceDataWorkflowServiceErrors = 'VIN not found' | 'Radio ID not found' | 'License plate data not found';

@Injectable({ providedIn: 'root' })
/**
 * Takes device data (radio id or vin or license plate data) and validates the device when a match is found.
 */
export class ValidateDeviceDataWorkflowService implements DataWorkflow<DeviceDataRequest, RadioModel> {
    constructor(
        private readonly _validateDeviceByRadioIdWorkflowService: ValidateDeviceByRadioIdWorkflowService,
        private readonly _validateDeviceByVinWorkflowService: ValidateDeviceByVinWorkflowService,
        private readonly _validateDeviceByLicensePlateDataWorkflowService: ValidateDeviceByLicensePlateDataWorkflowService
    ) {}

    build({ lookupType, identifier }: DeviceDataRequest): Observable<RadioModel> {
        let stream$;
        switch (lookupType) {
            case 'licensePlate':
                stream$ = this._validateDeviceByLicensePlateDataWorkflowService.build(identifier as LicensePlateIdentifier);
                break;
            case 'radioId':
                stream$ = this._validateDeviceByRadioIdWorkflowService.build(identifier as string);
                break;
            case 'vin':
                stream$ = this._validateDeviceByVinWorkflowService.build(identifier as string);
                break;
        }
        return stream$.pipe(
            // NOTE: Temp code to handle not found scenario when endpoint is actually returning a 400 error
            //       (ideally we would handle this at the workflow build method but because other code is using that we need
            //        to iteratively plan that change)
            catchError((error) => {
                if (error.status === 400) {
                    const responseError = error?.error?.error;
                    if (responseError?.fieldErrors.find((fieldError) => fieldError?.errorCode === 'INVALID_MISSING_VIN' && fieldError?.fieldName.toLowerCase() === 'vin')) {
                        return throwError('VIN not found' as ValidateDeviceDataWorkflowServiceErrors);
                    } else if (
                        responseError?.fieldErrors.find((fieldError) => fieldError?.errorCode === 'INVALID_DEVICE_ID' && fieldError?.fieldName.toLowerCase() === 'radioid')
                    ) {
                        return throwError('Radio ID not found' as ValidateDeviceDataWorkflowServiceErrors);
                    }
                }
                return throwError(error as ValidateDeviceDataWorkflowServiceErrors);
            })
        );
    }
}
