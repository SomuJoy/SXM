import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { RadioModel } from '../data-services/device-validate.service';
import { LicencePlateLookupService } from '../data-services/licence-plate-lookup.service';
import { ValidateDeviceByVinWorkflowService } from './validate-device-by-vin-workflow.service';

@Injectable({ providedIn: 'root' })
export class ValidateDeviceByLicensePlateDataWorkflowService implements DataWorkflow<{ licensePlate: string; state: string }, RadioModel> {
    constructor(
        private readonly _licencePlateLookupService: LicencePlateLookupService,
        private readonly _validateDeviceByVinWorkflowService: ValidateDeviceByVinWorkflowService
    ) {}

    build(request: { licensePlate: string; state: string }): Observable<RadioModel> {
        return this._licencePlateLookupService.validate(request).pipe(
            concatMap(({ last4DigitsOfVin }) =>
                this._validateDeviceByVinWorkflowService.build(last4DigitsOfVin).pipe(
                    map((radioModel) => ({
                        ...radioModel,
                        last4DigitsOfVin,
                    })),
                    //If this service throws an error then we need to report that license plate lookup failed
                    catchError(() => throwError('License plate data not found'))
                )
            )
        );
    }
}
