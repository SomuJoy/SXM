import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    CheckIfRadioIsStreamingEligibleWorkflowService,
    getAccountIsInPreTrial,
    getFirstAccountSubscriptionRadioId,
    LoadAccountFromAccountDataWorkflow,
    VerifyAccountByLpzWorkflowService,
    getFirstAccountSubscriptionFirstPlanType,
    getClosedDevicesStatus,
    resetAccountStateToInitial,
} from '@de-care/domains/account/state-account';
import { ValidateDeviceByRadioIdOrVinWorkflowService } from '@de-care/domains/device/state-device-validate';
import { getPvtTime } from '@de-care/domains/utility/state-environment-info';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { behaviorEventReactionStreamingRadioIdVinLookupReturned } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { selectLPZData } from '../state/selectors';
import { collectSelectedRadioIdLastFour } from '../state/actions';

interface WorkflowContextState {
    radioId: string;
    lpzData: { lastName: string; phoneNumber: string; zipCode: string };
}
export enum errorType {
    BUSINESS,
    SYSTEM,
    RADIO_NOT_ACTIVE = 'RADIO_NOT_ACTIVE',
}
@Injectable({ providedIn: 'root' })
export class FindAccountByRadioIdOrVinWorkflowService implements DataWorkflow<{ identifierToLookupWith: string }, boolean> {
    state: any;
    accountNumber: any;
    accountDetails: any;
    constructor(
        private readonly _store: Store,
        private readonly _validateDeviceByRadioIdOrVinWorkflowService: ValidateDeviceByRadioIdOrVinWorkflowService,
        private readonly _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow,
        private readonly _checkIfRadioIsStreamingEligibleWorkflowService: CheckIfRadioIsStreamingEligibleWorkflowService,
        private readonly _verifyAccountByLpzWorkflowService: VerifyAccountByLpzWorkflowService,
        private readonly _router: Router
    ) {}

    build({ identifierToLookupWith }): Observable<boolean> {
        return this._validateDevice(identifierToLookupWith).pipe(
            withLatestFrom(this._store.pipe(select(selectLPZData), take(1))),
            map(([radioId, lpzData]) => ({ lpzData, radioId } as WorkflowContextState)),
            concatMap((context) => this._loadAccount(context)),
            concatMap((context) =>
                this._store.select(getFirstAccountSubscriptionFirstPlanType).pipe(
                    take(1),
                    tap((type) =>
                        this._store.dispatch(behaviorEventReactionStreamingRadioIdVinLookupReturned({ subscriptions: [{ type, last4DigitsOfRadioId: context.radioId }] }))
                    ),
                    mapTo(context)
                )
            ),
            withLatestFrom(this._store.pipe(select(getAccountIsInPreTrial)), this._store.pipe(select(getClosedDevicesStatus))),
            concatMap(([context, isInPreTrial, status]) => {
                if (status === 'closed' || status === 'inactive') {
                    this._clearAccountDataFromState();
                    return throwError('Radio not active');
                }
                return isInPreTrial
                    ? of(true)
                    : this._verifyLPZ(context).pipe(
                          concatMap((data) => this._checkStreamingEligible(data)),
                          mapTo(true)
                      );
            }),
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
            catchError((error) => {
                const errorResponse = error?.error?.error;
                if (errorResponse?.fieldErrors) {
                    if (errorResponse?.fieldErrors[0].errorType === 'BUSINESS') {
                        return throwError({ errorType: errorType.BUSINESS });
                    }
                } else if (error === 'Radio not active') {
                    return throwError({ errorType: errorType.RADIO_NOT_ACTIVE });
                }
                return throwError({ errorType: errorType.SYSTEM });
            })
        );
    }

    private _validateDevice(identifier): Observable<string> {
        return this._validateDeviceByRadioIdOrVinWorkflowService.build({ identifier }).pipe(
            map(({ last4DigitsOfRadioId }) => last4DigitsOfRadioId),
            catchError((_) => throwError(_))
        );
    }

    private _loadAccount(context: WorkflowContextState): Observable<WorkflowContextState> {
        const { radioId } = context;
        return this._store.pipe(
            select(getPvtTime),
            take(1),
            map((pvtTime) => ({ pvtTime, radioId })),
            concatMap((request) =>
                this._loadAccountFromAccountDataWorkflow.build(request).pipe(
                    mapTo(context),
                    catchError((_) => throwError(_))
                )
            )
        );
    }

    private _checkStreamingEligible(context: WorkflowContextState): Observable<WorkflowContextState> {
        const { radioId } = context;
        return this._checkIfRadioIsStreamingEligibleWorkflowService.build({ radioId }).pipe(
            map((isStreamingEligible) => {
                if (!isStreamingEligible) {
                    throwError(isStreamingEligible);
                } else {
                    if (isStreamingEligible['statusCode']) {
                        // TODO: This should return a status (probably Enum) from this workflow and the redirect logic would be the
                        //       responsibility of the feature lib since it is the one that manages route entries
                        if (isStreamingEligible['ineligibleReasonCodes'] && isStreamingEligible['ineligibleReasonCodes'].length > 0) {
                            const ineligibleReason = isStreamingEligible['ineligibleReasonCodes'][0].toLowerCase();
                            const hasOACCredentials = isStreamingEligible['hasOACCredentials'];
                            if (ineligibleReason === 'paymentissues') {
                                this._router.navigate(['/setup-credentials/ineligible-non-pay']);
                            } else if (ineligibleReason === 'nonconsumer') {
                                this._router.navigate(['/setup-credentials/ineligible-non-consumer']);
                            } else if (ineligibleReason === 'trialwithinlasttrialdate') {
                                this._router.navigate(['/setup-credentials/ineligible-trial-within-last-trial-date']);
                            } else if (ineligibleReason === 'maxlifetimetrials') {
                                this._router.navigate(['/setup-credentials/ineligible-max-lifetime-trials']);
                            } else if (ineligibleReason === 'insufficientpackage') {
                                this._router.navigate(['/setup-credentials/ineligible-insufficient-package']);
                            } else if (ineligibleReason === 'expiredaatrial') {
                                this._router.navigate(['/setup-credentials/ineligible-expired-AA-trial']);
                            } else if (ineligibleReason === 'existingsxirnocredentials') {
                                this._router.navigate(['/setup-credentials/credential-setup']);
                            } else if (ineligibleReason === 'existingsxir' && hasOACCredentials === false) {
                                this._router.navigate(['/setup-credentials/credential-setup']);
                            } else if (ineligibleReason === 'existingsxir' && hasOACCredentials === true) {
                                this._router.navigate(['/setup-credentials/singlematch-oac']);
                            }
                        } else if (isStreamingEligible['eligibleService']) {
                            const eligibleService = isStreamingEligible['eligibleService'].toLowerCase();
                            if (eligibleService === 'sxir_standalone') {
                                this._router.navigate(['/setup-credentials/ineligible-no-audio']);
                            }
                        }
                    }
                }
                return context;
            }),
            catchError((_) => throwError(_))
        );
    }

    private _verifyLPZ(context: WorkflowContextState): Observable<WorkflowContextState> {
        const { lpzData } = context;
        return this._verifyAccountByLpzWorkflowService.build(lpzData).pipe(
            map((verified) => {
                if (!verified) {
                    throw {
                        error: {
                            error: {
                                fieldErrors: [{ errorType: 'BUSINESS' }],
                            },
                        },
                    };
                }
                return context;
            }),
            catchError((_) => throwError(_))
        );
    }
    private _clearAccountDataFromState() {
        // When the radio is invalid or the lpz data is not a match we should clear out the account data we loaded into state
        this._store.dispatch(resetAccountStateToInitial());
    }
}
