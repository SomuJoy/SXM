import { Injectable } from '@angular/core';
import { FindAccountNonPiiDirectResponseWorkflowService } from '@de-care/domains/account/state-account';
import { GetDeviceInfoWorkflowService } from '@de-care/domains/device/state-device-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, take } from 'rxjs/operators';
import { setDeviceInfo } from '../state/actions';
import { getSelectedRadioId } from '../state/public.selectors';
import { behaviorEventReactionClosedDevicesInfo } from '@de-care/shared/state-behavior-events';
import { setSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';

export type GetDeviceStatusForRouterWorkflowServiceResult = 'ESN in use' | 'ESN not in use' | 'ESN in pending state';
export type GetDeviceStatusForRouterWorkflowServiceErrors = 'SYSTEM' | 'DEVICE_NOT_ELIGIBLE' | 'TRANSFER_ERROR';

@Injectable({ providedIn: 'root' })
export class GetDeviceStatusForRouterWorkflowService implements DataWorkflow<string, GetDeviceStatusForRouterWorkflowServiceResult> {
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
                            if (account?.closedDevices?.length > 0) {
                                this._store.dispatch(
                                    behaviorEventReactionClosedDevicesInfo({
                                        closedDevices: account?.closedDevices?.map((d) => {
                                            return { dateClosed: d.closedDate, esnLast4Digits: d.last4DigitsOfRadioId };
                                        }),
                                    })
                                );
                            }
                            if (account?.serviceAddress?.country.toLowerCase() === 'ca') {
                                this._store.dispatch(setSelectedProvinceCode({ provinceCode: account?.serviceAddress?.state }));
                            }

                            return {
                                selectedDeviceNickname: selectedDeviceSubscription?.nickname,
                                subscriptionHasDuplicateVehicleInfo: selectedDeviceSubscription?.hasDuplicateVehicleInfo,
                                isActiveTrial: selectedDeviceSubscription.status === 'Active' && selectedDeviceSubscription?.plans[0]?.type === 'TRIAL',
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
                                if (data.deviceStatus === 'ESN in pending state') {
                                    throw 'DEVICE_NOT_ELIGIBLE' as GetDeviceStatusForRouterWorkflowServiceErrors;
                                } else if (data.deviceStatus === 'ESN in use') {
                                    if (deviceInfoPartial.isActiveTrial) {
                                        return 'AC_SC';
                                    } else {
                                        throw 'TRANSFER_ERROR' as GetDeviceStatusForRouterWorkflowServiceErrors;
                                    }
                                }
                                return data.deviceStatus as GetDeviceStatusForRouterWorkflowServiceResult;
                            }),
                            catchError((error) => {
                                if (error) {
                                    return throwError(error as GetDeviceStatusForRouterWorkflowServiceErrors);
                                } else {
                                    return throwError('SYSTEM' as GetDeviceStatusForRouterWorkflowServiceErrors);
                                }
                            })
                        )
                    )
                )
            )
        );
    }
}
