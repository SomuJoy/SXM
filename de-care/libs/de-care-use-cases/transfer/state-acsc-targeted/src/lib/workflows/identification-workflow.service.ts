import { Injectable } from '@angular/core';
import {
    LoadAccountFromAcscTokenWorkflowService,
    LoadAccountWorkflowService,
    doAnySCEligibleSubscriptionsHaveDataPlans,
    getAccountServiceAddress,
} from '@de-care/domains/account/state-account';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, take, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import {
    setTrialRadioAccount,
    setTransactionId,
    setDefaultFlowMode,
    setModeToServiceContinuity,
    setRadioIdToReplace,
    setSelfPayRadioAsClosed,
    setIsLoggedIn,
    setEligibilityStatus,
    setSelfPayAccountNumberForACOnly,
    setSelectedSelfPaySubscriptionIdFromOAC,
} from '../state/actions';
import * as uuid from 'uuid/v4';
import {
    behaviorEventReactionForTransactionId,
    behaviorEventReactionAcscTrialPackageName,
    behaviorEventReactionAcscNumberOfScEligibleDevices,
    behaviorEventReactionCustomerInfoAuthenticationType,
    behaviorEventImpressionForPage,
    behaviorEventErrorFromBusinessLogic,
} from '@de-care/shared/state-behavior-events';
import { DefaultMode, EligibilityStatus } from '../state/reducer';
import { getIsLoggedIn, getEligibilityStatus } from '../state/selectors/state.selectors';
import { RadioLookupWorkflowService } from './radio-lookup-workflow.service';
import { UserSettingsService, SettingsService } from '@de-care/settings';

// The values being used in the response enum are simply for demonstration purpose,
// In the future, when we have the variety of success and failure reasons, we can update this enum

export enum IndentificationWorkflowServiceResponseEnum {
    SUCCESS = 'SUCCESS',
    NETWORK_ERROR = 'NETWORK_ERROR',
    INVALID_ACSC_TOKEN = 'INVALID_ACSC_TOKEN',
    TRIAL_ALREADY_CONSOLIDATED_AND_HAS_FOLLOWON = 'TRIAL_ALREADY_CONSOLIDATED_AND_HAS_FOLLOWON',
    TRIAL_ALREADY_CONSOLIDATED_AND_NO_FOLLOWON = 'TRIAL_ALREADY_CONSOLIDATED_AND_NO_FOLLOWON',
    NO_TRIAL_RADIO_ID = 'NO_TRIAL_RADIO_ID',
}

@Injectable({ providedIn: 'root' })
export class IdentificationWorkflowService implements DataWorkflow<null, IndentificationWorkflowServiceResponseEnum> {
    constructor(
        private readonly _store: Store,
        private readonly _loadAccountFromAcscToken: LoadAccountFromAcscTokenWorkflowService,
        private readonly _loadAccountWorkflowService: LoadAccountWorkflowService,
        private readonly _radioLookupWorkflowService: RadioLookupWorkflowService,
        private readonly _settingsService: SettingsService,
        private readonly _userSettingsService: UserSettingsService
    ) {}

    build(): Observable<IndentificationWorkflowServiceResponseEnum> {
        return this._store.pipe(
            select(getNormalizedQueryParams),
            withLatestFrom(this._store.pipe(select(getIsLoggedIn)), this._store.pipe(select(getEligibilityStatus))),
            take(1),
            concatMap(([{ token, mode, radioid, trialradioid, subscriptionid }, isLoggedIn, eligibilityStatus]) => {
                const modeFromParam = this._setModeFromParam(mode);
                if (subscriptionid) {
                    this._store.dispatch(setSelectedSelfPaySubscriptionIdFromOAC({ subscriptionId: subscriptionid }));
                }
                if (token) {
                    return this._loadAccountFromAcscToken.build({ token }).pipe(
                        map((account) => {
                            // TODO: Refactor required - All the account information can be handled directly in the account domain state.
                            // status, selfPay, closedDevice can be obtained from selectors in the account domain state.
                            const status = account.eligibilityStatus;
                            const modeSet = this._setModeFromAcscEligibilityStatus(status, modeFromParam);
                            const isSCOnly = modeSet === DefaultMode.SC_ONLY;
                            const accountClone = { ...account };
                            const { sCEligibleClosedDevices, sCEligibleSelfPaySubscriptions } = accountClone;
                            const selfPay = sCEligibleSelfPaySubscriptions.find((subscription) => subscription.radioService.last4DigitsOfRadioId === radioid);
                            const closedDevice = sCEligibleClosedDevices.find((device) => device.last4DigitsOfRadioId === radioid);
                            const isSCOnlyModeFromParam = mode === DefaultMode.SC_ONLY;

                            this._store.dispatch(setEligibilityStatus({ eligibilityStatus: status }));

                            if (isSCOnly && !isSCOnlyModeFromParam) {
                                this._store.dispatch(setModeToServiceContinuity());
                                this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'servicecontinuity', componentKey: 'subscription' }));
                            }

                            if (Boolean(selfPay) && isSCOnly) {
                                this._store.dispatch(setRadioIdToReplace({ radioIdToReplace: radioid }));
                                accountClone.sCEligibleSelfPaySubscriptions = [selfPay];
                                accountClone.sCEligibleClosedDevices = [];
                            }

                            if (Boolean(closedDevice) && isSCOnly) {
                                this._store.dispatch(setRadioIdToReplace({ radioIdToReplace: radioid }));
                                this._store.dispatch(setSelfPayRadioAsClosed());
                                accountClone.sCEligibleSelfPaySubscriptions = [];
                                accountClone.sCEligibleClosedDevices = [closedDevice];
                            }
                            if (modeSet === DefaultMode.AC_ONLY && account.selfPayAccountNumberForACOnly) {
                                this._store.dispatch(setSelfPayAccountNumberForACOnly({ selfPayAccountNumberForACOnly: account.selfPayAccountNumberForACOnly }));
                            }
                            this._store.dispatch(setTrialRadioAccount({ trialRadioAccount: accountClone.trialAccountResponse.nonPIIAccount }));
                            this._store.dispatch(
                                behaviorEventReactionAcscTrialPackageName({
                                    trialPackageName: accountClone.trialAccountResponse.nonPIIAccount.subscriptions[0].plans[0].packageName,
                                })
                            );
                            this._store.dispatch(
                                behaviorEventReactionAcscNumberOfScEligibleDevices({
                                    numberScEligibleDevices: accountClone.sCEligibleSelfPaySubscriptions.length + accountClone.sCEligibleClosedDevices.length,
                                })
                            );
                            switch (status) {
                                case IndentificationWorkflowServiceResponseEnum.TRIAL_ALREADY_CONSOLIDATED_AND_HAS_FOLLOWON:
                                case IndentificationWorkflowServiceResponseEnum.TRIAL_ALREADY_CONSOLIDATED_AND_NO_FOLLOWON:
                                    return status;
                            }
                            return IndentificationWorkflowServiceResponseEnum.SUCCESS;
                        })
                    );
                } else {
                    if (isLoggedIn) {
                        // came from radio lookup page or login page
                        this._setModeFromAcscEligibilityStatus(eligibilityStatus, modeFromParam);
                        return of(IndentificationWorkflowServiceResponseEnum.SUCCESS);
                    } else {
                        // came directly from OAC so isLoggedIn has not been set yet
                        if (trialradioid) {
                            // load account through SSO
                            return this._loadAccountWorkflowService.build({}).pipe(
                                withLatestFrom(this._store.pipe(select(getAccountServiceAddress))),
                                tap(([_, serviceAddress]) => {
                                    this._store.dispatch(setIsLoggedIn());
                                    if (this._settingsService.isCanadaMode) {
                                        const province = serviceAddress?.state;
                                        this._userSettingsService.setSelectedCanadianProvince(province);
                                    }
                                }),
                                concatMap(() => {
                                    // get trial account using trial radio id
                                    return this._radioLookupWorkflowService.build(trialradioid).pipe(
                                        withLatestFrom(this._store.pipe(select(getEligibilityStatus))),
                                        map(([, eligibilityStatus]) => {
                                            this._setModeFromAcscEligibilityStatus(eligibilityStatus, modeFromParam);
                                            return IndentificationWorkflowServiceResponseEnum.SUCCESS;
                                        }),
                                        catchError(() => throwError(IndentificationWorkflowServiceResponseEnum.NETWORK_ERROR))
                                    );
                                }),
                                catchError(() => throwError(IndentificationWorkflowServiceResponseEnum.NETWORK_ERROR))
                            );
                        } else {
                            return throwError(IndentificationWorkflowServiceResponseEnum.NO_TRIAL_RADIO_ID);
                        }
                    }
                }
            }),
            tap(() => {
                const transactionId = `OAC-${uuid()}`;
                this._store.dispatch(setTransactionId({ transactionId }));
                this._store.dispatch(behaviorEventReactionForTransactionId({ transactionId: transactionId }));
                this._store.dispatch(behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'TOKEN_URL' }));
            }),
            withLatestFrom(this._store.pipe(select(doAnySCEligibleSubscriptionsHaveDataPlans))),
            map(([response, hasDataPlans]) => {
                if (hasDataPlans) {
                    this._store.dispatch(behaviorEventErrorFromBusinessLogic({ message: 'Ford Exec Warning Msg' }));
                }
                return response;
            }),
            catchError((error) => {
                const errorCode = error?.error?.error?.errorCode ?? '';
                if (error?.status === 400 && errorCode) {
                    switch (errorCode) {
                        case IndentificationWorkflowServiceResponseEnum.INVALID_ACSC_TOKEN:
                        case IndentificationWorkflowServiceResponseEnum.TRIAL_ALREADY_CONSOLIDATED_AND_HAS_FOLLOWON:
                        case IndentificationWorkflowServiceResponseEnum.TRIAL_ALREADY_CONSOLIDATED_AND_NO_FOLLOWON:
                            return of(errorCode);
                        default:
                            return of(IndentificationWorkflowServiceResponseEnum.NETWORK_ERROR);
                    }
                } else if (error === IndentificationWorkflowServiceResponseEnum.NO_TRIAL_RADIO_ID) {
                    return of(IndentificationWorkflowServiceResponseEnum.NO_TRIAL_RADIO_ID);
                } else {
                    return of(IndentificationWorkflowServiceResponseEnum.NETWORK_ERROR);
                }
            })
        );
    }

    private _setModeFromParam(mode): DefaultMode {
        const isValidMode = [DefaultMode.SC_ONLY].includes(mode?.toUpperCase()) || [DefaultMode.AC_ONLY].includes(mode?.toUpperCase());
        if (isValidMode) {
            return this._setModeFromUrlParamType(mode);
        } else {
            return null;
        }
    }

    private _setModeFromAcscEligibilityStatus(status: EligibilityStatus, mode): DefaultMode {
        if (!status) {
            if (!mode) {
                this._store.dispatch(setDefaultFlowMode({ defaultMode: null }));
                return null;
            } else {
                return this._setModeFromUrlParamType(mode);
            }
        } else {
            if (status === 'SC_ONLY') {
                this._store.dispatch(setDefaultFlowMode({ defaultMode: DefaultMode.SC_ONLY }));
                return DefaultMode.SC_ONLY;
            } else if (status === 'AC_ONLY') {
                this._store.dispatch(setDefaultFlowMode({ defaultMode: DefaultMode.AC_ONLY }));
                return DefaultMode.AC_ONLY;
            } else if (status === 'AC_AND_SC') {
                if (mode === 'AC' || mode === 'SC') {
                    return this._setModeFromUrlParamType(mode);
                } else {
                    this._store.dispatch(setDefaultFlowMode({ defaultMode: null }));
                    return null;
                }
            }
        }
    }

    private _setModeFromUrlParamType(mode: string) {
        switch (mode?.toUpperCase()) {
            case DefaultMode.AC_ONLY:
                this._store.dispatch(setDefaultFlowMode({ defaultMode: DefaultMode.AC_ONLY }));
                return DefaultMode.AC_ONLY;
            case DefaultMode.SC_ONLY:
                this._store.dispatch(setDefaultFlowMode({ defaultMode: DefaultMode.SC_ONLY }));
                return DefaultMode.SC_ONLY;
        }
    }
}
