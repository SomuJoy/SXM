import { Injectable } from '@angular/core';
import { GetDeviceInfoWorkflowService } from '@de-care/domains/device/state-device-info';
import { ValidateDeviceByRadioIdOrVinWorkflowService, vinLike } from '@de-care/domains/device/state-device-validate';
import { LoadCustomerOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, withLatestFrom } from 'rxjs/operators';
import { setDeviceInfo } from '../state/actions';
import { getCustomerOffersRequestData } from '../state/selectors';

export type ValidateDeviceInfoWorkflowErrors = 'DEVICE_NOT_ELIGIBLE' | 'DEVICE_NOT_FOUND' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class ValidateDeviceInfoWorkflowService implements DataWorkflow<string, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _validateDeviceByRadioIdOrVinWorkflowService: ValidateDeviceByRadioIdOrVinWorkflowService,
        private readonly _getDeviceInfoWorkflowService: GetDeviceInfoWorkflowService,
        private readonly _loadCustomerOffersWithCmsContent: LoadCustomerOffersWithCmsContent
    ) {}

    build(identifier: string): Observable<boolean> {
        return this._validateDeviceByRadioIdOrVinWorkflowService.build({ identifier }).pipe(
            concatMap((data) =>
                this._getDeviceInfoWorkflowService.build(data.last4DigitsOfRadioId).pipe(
                    map((deviceInfo) => ({
                        ...data,
                        vehicleInfo: deviceInfo.vehicle,
                    }))
                )
            ),
            map(({ deviceStatus, ...data }) => {
                this._store.dispatch(setDeviceInfo({ deviceInfo: { ...data, deviceStatus } }));
                const deviceIsEligible = ['NEW'].includes(deviceStatus.toUpperCase());
                if (!deviceIsEligible) {
                    throw 'DEVICE_NOT_ELIGIBLE' as ValidateDeviceInfoWorkflowErrors;
                }
                return true;
            }),
            withLatestFrom(this._store.select(getCustomerOffersRequestData)),
            concatMap(([, request]) => this._loadCustomerOffersWithCmsContent.build(request)),
            catchError((error) => {
                // TODO: look to move this logic into ValidateDeviceByRadioIdOrVinWorkflowService
                if (error?.status === 500) {
                    const errorStackTrace = error?.error?.error?.errorStackTrace;
                    if (errorStackTrace?.includes('Device ID not found') || errorStackTrace?.includes('Device ID Checksum Failed')) {
                        return throwError('DEVICE_NOT_FOUND' as ValidateDeviceInfoWorkflowErrors);
                    }
                    if (vinLike.test(identifier) && errorStackTrace?.toLowerCase().includes('checksum failed')) {
                        return throwError('DEVICE_NOT_FOUND' as ValidateDeviceInfoWorkflowErrors);
                    }
                    if (errorStackTrace?.includes('Not Found')) {
                        return throwError('DEVICE_NOT_FOUND' as ValidateDeviceInfoWorkflowErrors);
                    }
                }
                return throwError(error);
            })
        );
    }
}
