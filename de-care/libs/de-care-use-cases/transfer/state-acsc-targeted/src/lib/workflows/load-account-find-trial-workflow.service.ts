import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store, select } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, take, catchError, tap, mergeMap, withLatestFrom } from 'rxjs/operators';
import {
    setSelectedSelfPaySubscriptionIdFromOAC,
    setIsLoggedIn,
    setDefaultFlowMode,
    resetFeatureStateToInitial,
    setTrialRadioAccount,
    setEligibilityStatus,
} from '../state/actions';
import { LoadAccountWorkflowService, resetAccountStateToInitial, LoadAccountAcscWorkflowService, getAccountServiceAddress } from '@de-care/domains/account/state-account';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { DefaultMode } from '../state/reducer';
import { UserSettingsService, SettingsService } from '@de-care/settings';

export type LoadAccountFindTrialWorkflowServiceResponseStatus = 'success' | 'no trial account';
// TODO: add other types of errors if necessary to differentiate
export type LoadAccountFindTrialWorkflowServiceError = 'network error';

@Injectable({ providedIn: 'root' })
export class LoadAccountFindTrialWorkflowService implements DataWorkflow<null, LoadAccountFindTrialWorkflowServiceResponseStatus> {
    constructor(
        private readonly _store: Store,
        private readonly _loadAccountWorkflowService: LoadAccountWorkflowService,
        private readonly _loadAccountAcscWorkflowService: LoadAccountAcscWorkflowService,
        private readonly _settingsService: SettingsService,
        private readonly _userSettingsService: UserSettingsService
    ) {}

    build(): Observable<LoadAccountFindTrialWorkflowServiceResponseStatus> {
        return this._store.pipe(
            select(getNormalizedQueryParams),
            take(1),
            concatMap(({ mode, subscriptionid }) => {
                this._store.dispatch(resetAccountStateToInitial());
                this._store.dispatch(resetFeatureStateToInitial());
                if (mode === DefaultMode.SC_ONLY) {
                    this._store.dispatch(setDefaultFlowMode({ defaultMode: DefaultMode.SC_ONLY }));
                }
                if (subscriptionid) {
                    this._store.dispatch(setSelectedSelfPaySubscriptionIdFromOAC({ subscriptionId: subscriptionid }));
                }
                let status: LoadAccountFindTrialWorkflowServiceResponseStatus;
                return this._loadAccountWorkflowService.build({}).pipe(
                    withLatestFrom(this._store.pipe(select(getAccountServiceAddress))),
                    tap(([_, serviceAddress]) => {
                        this._store.dispatch(setIsLoggedIn());
                        if (this._settingsService.isCanadaMode) {
                            const province = serviceAddress?.state;
                            this._userSettingsService.setSelectedCanadianProvince(province);
                        }
                    }),
                    concatMap(() =>
                        this._loadAccountAcscWorkflowService.build({}).pipe(
                            mergeMap((response) => {
                                if (response?.trialAccount) {
                                    this._store.dispatch(setEligibilityStatus({ eligibilityStatus: response.eligibilityStatus }));
                                    this._store.dispatch(setTrialRadioAccount({ trialRadioAccount: response.trialAccount }));
                                    status = 'success';
                                } else {
                                    status = 'no trial account';
                                }
                                return of(status);
                            }),
                            catchError((error) => throwError(error))
                        )
                    ),
                    catchError(() => {
                        // not eligible error is treated like any error
                        const error: LoadAccountFindTrialWorkflowServiceError = 'network error';
                        return throwError(error);
                    })
                );
            })
        );
    }
}
