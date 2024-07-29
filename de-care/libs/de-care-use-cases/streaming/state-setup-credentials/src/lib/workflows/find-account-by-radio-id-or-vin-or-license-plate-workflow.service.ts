import { Injectable } from '@angular/core';
import {
    getFirstAccountSubscriptionRadioId,
    getFirstAccountSubscriptionFirstPlanType,
    LoadAccountAndStreamingEligibilityFromRadioIdAndLpzDataWorkflowService,
    getFirstAccountSubscription,
    getAccountIsInPreTrial,
} from '@de-care/domains/account/state-account';
import { DeviceDataRequest, ValidateDeviceDataWorkflowService } from '@de-care/domains/device/state-device-validate';
import { getPvtTime } from '@de-care/domains/utility/state-environment-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { behaviorEventReactionStreamingRadioIdVinLookupReturned } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { selectLPZData } from '../state/selectors';
import { collectSelectedRadioIdLastFour } from '../state/actions';

interface WorkflowContextState {
    radioId: string;
    lpzData: { lastName: string; phoneNumber: string; zipCode: string };
}

export interface FindAccountByRadioIdOrVinOrLicensePlateWorkflowResults {
    ineligibleReason?:
        | 'NonPay'
        | 'NonConsumer'
        | 'TrialWithinLastTrialDate'
        | 'MaxLifetimeTrials'
        | 'InsufficientPackage'
        | 'ExpiredAATrial'
        | 'NeedsCredentials'
        | 'SingleMatchOAC'
        | 'NoAudio';
    isInPreTrial?: boolean;
}

export enum FindAccountByRadioIdOrVinOrLicensePlateWorkflowError {
    BUSINESS = 'BUSINESS',
    SYSTEM = 'SYSTEM',
    LICENSE_PLATE_DATA_NOT_FOUND = 'LICENSE_PLATE_DATA_NOT_FOUND',
    RADIO_ID_NOT_FOUND = 'RADIO_ID_NOT_FOUND',
    VIN_NOT_FOUND = 'VIN_NOT_FOUND',
    RADIO_NOT_ACTIVE = 'RADIO_NOT_ACTIVE',
    CLOSED_RADIO_ID = 'CLOSED_RADIO_ID',
}
@Injectable({ providedIn: 'root' })
export class FindAccountByRadioIdOrVinOrLicensePlateWorkflowService implements DataWorkflow<DeviceDataRequest, FindAccountByRadioIdOrVinOrLicensePlateWorkflowResults> {
    constructor(
        private readonly _store: Store,
        private readonly _validateDeviceDataWorkflowService: ValidateDeviceDataWorkflowService,
        private readonly _loadAccountAndStreamingEligibilityFromRadioIdAndLpzDataWorkflowService: LoadAccountAndStreamingEligibilityFromRadioIdAndLpzDataWorkflowService
    ) {}

    build(deviceDataRequest: DeviceDataRequest): Observable<FindAccountByRadioIdOrVinOrLicensePlateWorkflowResults> {
        return this._validateDevice(deviceDataRequest).pipe(
            withLatestFrom(this._store.pipe(select(selectLPZData), take(1))),
            map(([radioId, lpzData]) => ({ lpzData, radioId } as WorkflowContextState)),
            concatMap((context) => this._loadAccount(context)),
            concatMap((context) =>
                this._store.select(getFirstAccountSubscriptionFirstPlanType).pipe(
                    take(1),
                    tap((type) =>
                        this._store.dispatch(behaviorEventReactionStreamingRadioIdVinLookupReturned({ subscriptions: [{ type, last4DigitsOfRadioId: context.radioId }] }))
                    ),
                    mapTo(true)
                )
            ),
            concatMap((success) =>
                this._store.select(getFirstAccountSubscriptionRadioId).pipe(
                    take(1),
                    tap((last4DigitsOfRadioId) => {
                        if (last4DigitsOfRadioId) {
                            this._store.dispatch(collectSelectedRadioIdLastFour({ selectedRadioIdLastFour: last4DigitsOfRadioId }));
                        }
                    }),
                    mapTo(success)
                )
            ),
            withLatestFrom(this._store.select(getFirstAccountSubscription), this._store.pipe(select(getAccountIsInPreTrial))),
            map(([, subscription, isInPreTrial]) => {
                const data: FindAccountByRadioIdOrVinOrLicensePlateWorkflowResults = { isInPreTrial };
                if (subscription.ineligibleReasonCodes && subscription.ineligibleReasonCodes.length > 0) {
                    const ineligibleReason = subscription.ineligibleReasonCodes[0].toLowerCase();
                    if (ineligibleReason === 'paymentissues') {
                        data.ineligibleReason = 'NonPay';
                    } else if (ineligibleReason === 'nonconsumer') {
                        data.ineligibleReason = 'NonConsumer';
                    } else if (ineligibleReason === 'trialwithinlasttrialdate') {
                        data.ineligibleReason = 'TrialWithinLastTrialDate';
                    } else if (ineligibleReason === 'maxlifetimetrials') {
                        data.ineligibleReason = 'MaxLifetimeTrials';
                    } else if (ineligibleReason === 'insufficientpackage') {
                        data.ineligibleReason = 'InsufficientPackage';
                    } else if (ineligibleReason === 'expiredaatrial') {
                        data.ineligibleReason = 'ExpiredAATrial';
                    } else if (ineligibleReason === 'existingsxirnocredentials') {
                        data.ineligibleReason = 'NeedsCredentials';
                    } else if (ineligibleReason === 'existingsxir' && subscription.hasOACCredentials === false) {
                        data.ineligibleReason = 'NeedsCredentials';
                    } else if (ineligibleReason === 'existingsxir' && subscription.hasOACCredentials === true) {
                        data.ineligibleReason = 'SingleMatchOAC';
                    }
                } else if (subscription.eligibleService) {
                    const eligibleService = subscription.eligibleService.toLowerCase();
                    if (eligibleService === 'sxir_standalone') {
                        data.ineligibleReason = 'NoAudio';
                    }
                }
                return data;
            }),
            catchError((error) => {
                if (error === 'Radio not active') {
                    return throwError({ errorType: FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.CLOSED_RADIO_ID });
                } else if (error === 'Radio ID not found') {
                    return throwError({ errorType: FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.RADIO_ID_NOT_FOUND });
                } else if (error === 'License plate data not found') {
                    return throwError({ errorType: FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.LICENSE_PLATE_DATA_NOT_FOUND });
                } else if (error === 'VIN not found') {
                    return throwError({ errorType: FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.VIN_NOT_FOUND });
                } else if (error?.message === 'subscription is null') {
                    return throwError({ errorType: FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.RADIO_ID_NOT_FOUND });
                }
                const errorResponse = error?.error?.error;
                if (errorResponse?.fieldErrors) {
                    if (errorResponse?.fieldErrors[0].errorType === 'BUSINESS') {
                        return throwError({ errorType: FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.BUSINESS });
                    }
                }
                return throwError({ errorType: FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.SYSTEM });
            })
        );
    }

    private _validateDevice(deviceDataRequest: DeviceDataRequest): Observable<string> {
        return this._validateDeviceDataWorkflowService.build(deviceDataRequest).pipe(
            map(({ last4DigitsOfRadioId }) => last4DigitsOfRadioId),
            catchError((_) => throwError(_))
        );
    }

    private _loadAccount(context: WorkflowContextState): Observable<WorkflowContextState> {
        const { radioId } = context;
        return this._store.pipe(
            select(getPvtTime),
            take(1),
            map((pvtTime) => ({ pvtTime, radioId, ...context.lpzData })),
            concatMap((request) =>
                this._loadAccountAndStreamingEligibilityFromRadioIdAndLpzDataWorkflowService.build(request).pipe(
                    mapTo(context),
                    catchError((_) => throwError(_))
                )
            )
        );
    }
}
