import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, mergeMap, take, catchError, withLatestFrom, tap, mapTo } from 'rxjs/operators';
import { getEligibilityStatus, getSwapNewRadioService, getSelectedSelfPaySubscriptionIdFromOAC } from '../state/selectors/state.selectors';
import { DefaultMode } from '../state/reducer';
import { LoadAccountAcscWorkflowService, getAccountSCEligibleSubscriptions, getAccountSCEligibleClosedDevices } from '@de-care/domains/account/state-account';
import { ValidateDeviceByRadioIdOrVinWorkflowService, radioIdLike, vinLike } from '@de-care/domains/device/state-device-validate';
import { setEligibilityStatus, setDefaultFlowMode, setSwapNewRadioService, setTrialRadioAccount } from '../state/actions';
import { behaviorEventReactionAcscNumberOfScEligibleDevices, behaviorEventReactionSwapRadioIdToMarketingId } from '@de-care/shared/state-behavior-events';
import { DeviceInfoWorkflow, getVehicleInfo } from '@de-care/domains/device/state-device-info';

export type SwapRadioLookupSubmitWorkflowServiceResults = 'CAN_SWAP' | 'REQUIRES_SC';
export type SwapRadioLookupSubmitWorkflowServiceErrors =
    | 'NEW_RADIO_LACKS_CAPABILITIES'
    | 'NEW_RADIO_ELIGIBLE_FOR_LIFE_TIME_PLAN'
    | 'ACSC_RADIO_IS_ON_SAME_ACCOUNT'
    | 'SUBSCRIPTION_HAS_INELIGIBLE_PLAN'
    | 'INVALID_RADIO'
    | 'INVALID_VIN'
    | 'NOT_FOUND_VIN'
    | 'DEFAULT';
@Injectable({ providedIn: 'root' })
export class SwapRadioLookupSubmitWorkflowService implements DataWorkflow<string, SwapRadioLookupSubmitWorkflowServiceResults> {
    constructor(
        private readonly _store: Store,
        private readonly _validateDeviceByRadioIdOrVinWorkflowService: ValidateDeviceByRadioIdOrVinWorkflowService,
        private readonly _loadAccountAcscWorkflowService: LoadAccountAcscWorkflowService,
        private readonly _deviceInfoWorkflow: DeviceInfoWorkflow
    ) {}

    build(identifier: string): Observable<SwapRadioLookupSubmitWorkflowServiceResults> {
        return this._validateDeviceByRadioIdOrVinWorkflowService.build({ identifier }).pipe(
            take(1),
            tap((response) => {
                this._store.dispatch(
                    setSwapNewRadioService({
                        swapNewRadioService: { last4DigitsOfRadioId: response.last4DigitsOfRadioId },
                    })
                );
            }),
            withLatestFrom(this._store.pipe(select(getSelectedSelfPaySubscriptionIdFromOAC)), this._store.pipe(select(getSwapNewRadioService))),
            concatMap(([validationResponse, subscriptionId, swapNewRadioServiceFromState]) =>
                this._loadAccountAcscWorkflowService.build({ radioId: validationResponse.last4DigitsOfRadioId, subscriptionId, swapFlow: true }).pipe(
                    tap((response) => {
                        this._store.dispatch(setTrialRadioAccount({trialRadioAccount:response.trialAccount}))
                        const closedDeviceVehicleInfo = response.trialAccount?.closedDevices?.[0]?.vehicleInfo;
                        // adds full radioid to state if a radio id was entered by the user
                        // also adds vehicle info from closed trialAccount (only there if radio is closed, not new)
                        if (radioIdLike.test(identifier)) {
                            this._store.dispatch(
                                setSwapNewRadioService({
                                    swapNewRadioService: {
                                        ...swapNewRadioServiceFromState,
                                        radioId: identifier,
                                        ...(closedDeviceVehicleInfo && { vehicleInfo: closedDeviceVehicleInfo }),
                                    },
                                })
                            );
                            this._store.dispatch(behaviorEventReactionSwapRadioIdToMarketingId({ marketingId: identifier }));
                        } else {
                            this._store.dispatch(behaviorEventReactionSwapRadioIdToMarketingId({ marketingId: validationResponse.last4DigitsOfRadioId }));
                        }
                        this._store.dispatch(setEligibilityStatus({ eligibilityStatus: response.eligibilityStatus }));
                        this._store.dispatch(setDefaultFlowMode({ defaultMode: DefaultMode.SC_ONLY }));
                    }),
                    withLatestFrom(this._store.pipe(select(getSwapNewRadioService))),
                    concatMap(([, swapNewRadioService]) => {
                        if (swapNewRadioService.vehicleInfo?.year && swapNewRadioService.vehicleInfo?.make && swapNewRadioService.vehicleInfo?.model) {
                            return of(true);
                        } else {
                            // call device info to get more radio information
                            return this._deviceInfoWorkflow.build(swapNewRadioService.radioId ?? swapNewRadioService.last4DigitsOfRadioId).pipe(
                                withLatestFrom(this._store.pipe(select(getVehicleInfo)), this._store.pipe(select(getSwapNewRadioService))),
                                tap(([, vehicleInfo, swapNewRadioServiceFromState]) => {
                                    this._store.dispatch(setSwapNewRadioService({ swapNewRadioService: { ...swapNewRadioServiceFromState, vehicleInfo } }));
                                }),
                                mapTo(true),
                                catchError((error) => throwError(error))
                            );
                        }
                    }),
                    catchError((err) => throwError(err))
                )
            ),
            withLatestFrom(
                this._store.pipe(select(getAccountSCEligibleSubscriptions)),
                this._store.pipe(select(getAccountSCEligibleClosedDevices)),
                this._store.pipe(select(getEligibilityStatus))
            ),
            mergeMap(([, sCEligibleSubscriptions, sCEligibleClosedDevices, eligibilityStatus]) => {
                this._store.dispatch(
                    behaviorEventReactionAcscNumberOfScEligibleDevices({
                        numberScEligibleDevices: sCEligibleSubscriptions.length + sCEligibleClosedDevices.length,
                    })
                );
                if (eligibilityStatus === 'SWAP') {
                    return of('CAN_SWAP' as SwapRadioLookupSubmitWorkflowServiceResults);
                } else if (eligibilityStatus === 'AC_AND_SC' || eligibilityStatus === 'SC_ONLY') {
                    return of('REQUIRES_SC' as SwapRadioLookupSubmitWorkflowServiceResults);
                } else {
                    return throwError('default');
                }
            }),
            catchError((err) => {
                if (err?.status === 500) {
                    const errorStackTrace = err?.error?.error?.errorStackTrace;
                    if (errorStackTrace?.includes('Device ID not found') || errorStackTrace?.includes('Device ID Checksum Failed') ) {
                        return throwError('INVALID_RADIO');
                    }
                    if (vinLike.test(identifier) && errorStackTrace?.toLowerCase().includes('checksum failed')) {
                        return throwError('INVALID_VIN');
                    }
                    if (errorStackTrace?.includes('VIN Not Found')) {
                        return throwError('NOT_FOUND_VIN');
                    }
                }
                if (err.status === 400) {
                    const errorCode = err?.error?.error?.fieldErrors?.[0]?.errorCode ?? err?.error?.error?.errorCode;
                    if (
                        errorCode === 'NEW_RADIO_LACKS_CAPABILITIES' ||
                        errorCode === 'NEW_RADIO_ELIGIBLE_FOR_LIFE_TIME_PLAN' ||
                        errorCode === 'ACSC_RADIO_IS_ON_SAME_ACCOUNT' ||
                        errorCode === 'SUBSCRIPTION_HAS_INELIGIBLE_PLAN'
                    ) {
                        return throwError(errorCode);
                    }
                }

                return throwError('DEFAULT');
            })
        );
    }
}
