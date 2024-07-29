import { Injectable } from '@angular/core';
import { FindAccountNonPiiDirectResponseWorkflowService } from '@de-care/domains/account/state-account';
import { GetDeviceInfoWorkflowService } from '@de-care/domains/device/state-device-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, take } from 'rxjs/operators';
import { getSelectedRadioId } from '../state/selectors';
import { setDeviceInfo } from '../state/actions';

export type LoadAccountAndDeviceInfoWorkflowServiceResult = 'ESN in use' | 'ESN not in use' | 'ESN in pending state';
export type LoadAccountAndDeviceInfoWorkflowServiceErrors = 'SYSTEM' | 'DEVICE_NOT_ELIGIBLE' | 'TRANSFER_ERROR';

@Injectable({ providedIn: 'root' })
export class LoadAccountAndDeviceInfoWorkflowService implements DataWorkflow<string, LoadAccountAndDeviceInfoWorkflowServiceResult> {
    constructor(
        private readonly _store: Store,
        private readonly _getDeviceInfoWorkflowService: GetDeviceInfoWorkflowService,
        private readonly _findAccountNonPiiDirectResponseWorkflowService: FindAccountNonPiiDirectResponseWorkflowService
    ) {}
    build(): Observable<any> {
        return this._store.select(getSelectedRadioId).pipe(
            take(1),
            concatMap((radioId) =>
                this._findAccountNonPiiDirectResponseWorkflowService.build({ radioId }).pipe(
                    map((response) => {
                        const account = response?.nonPIIAccount;
                        if (account) {
                            const subscriptions = account.subscriptions;
                            const closedDevices = account.closedDevices;
                            const hasEligibleSubscriptions = subscriptions && subscriptions.length > 0;
                            const selectedDeviceSubscription = hasEligibleSubscriptions ? subscriptions[0] : closedDevices[0].subscription;
                            return {
                                selectedDeviceNickname: selectedDeviceSubscription?.nickname,
                                subscriptionHasDuplicateVehicleInfo: selectedDeviceSubscription?.hasDuplicateVehicleInfo,
                            };
                        } else {
                            return null;
                        }
                    }),
                    concatMap((deviceInfoPartial) =>
                        this._getDeviceInfoWorkflowService.build(radioId).pipe(
                            map((data) => {
                                this._store.dispatch(
                                    setDeviceInfo({
                                        deviceInfo: {
                                            radioId: data.radioId,
                                            last4DigitsOfRadioId: radioId,
                                            vehicleInfo: data.vehicle,
                                            nickname: deviceInfoPartial?.selectedDeviceNickname,
                                            hasDuplicateVehicleInfo: deviceInfoPartial?.subscriptionHasDuplicateVehicleInfo,
                                        },
                                    })
                                );
                            }),
                            catchError((error) => {
                                if (error) {
                                    return throwError(error as LoadAccountAndDeviceInfoWorkflowServiceErrors);
                                } else {
                                    return throwError('SYSTEM' as LoadAccountAndDeviceInfoWorkflowServiceErrors);
                                }
                            })
                        )
                    )
                )
            )
        );
    }
}
