import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store, select } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { concatMap, take, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { setSelectedSelfPaySubscriptionIdFromOAC, setIsLoggedIn, setDefaultFlowMode, resetFeatureStateToInitial } from '../state/actions';
import { LoadAccountWorkflowService, resetAccountStateToInitial, getAccountServiceAddress } from '@de-care/domains/account/state-account';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { DefaultMode } from '../state/reducer';
import { LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { UserSettingsService, SettingsService } from '@de-care/settings';

export type IdentificationWithoutRadioWorkflowServiceError = 'user not logged in' | 'network error';
@Injectable({ providedIn: 'root' })
export class IdentificationWithoutRadioWorkflowService implements DataWorkflow<null, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadAccountWorkflowService: LoadAccountWorkflowService,
        private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService,
        private readonly _settingsService: SettingsService,
        private readonly _userSettingsService: UserSettingsService
    ) {}

    build(): Observable<boolean> {
        return this._loadEnvironmentInfoWorkflowService.build().pipe(
            withLatestFrom(this._store.pipe(select(getNormalizedQueryParams))),
            take(1),
            concatMap(([, { mode, subscriptionid }]) => {
                this._store.dispatch(resetAccountStateToInitial());
                this._store.dispatch(resetFeatureStateToInitial());
                if (mode === DefaultMode.SC_ONLY) {
                    this._store.dispatch(setDefaultFlowMode({ defaultMode: DefaultMode.SC_ONLY }));
                }
                if (subscriptionid) {
                    this._store.dispatch(setSelectedSelfPaySubscriptionIdFromOAC({ subscriptionId: subscriptionid }));
                }
                return this._loadAccountWorkflowService.build({}).pipe(
                    tap(() => {
                        this._store.dispatch(setIsLoggedIn());
                        this._store.dispatch(pageDataFinishedLoading());
                    }),
                    withLatestFrom(this._store.pipe(select(getAccountServiceAddress))),
                    tap(([_, serviceAddress]) => {
                        this._store.dispatch(setIsLoggedIn());
                        if (this._settingsService.isCanadaMode) {
                            const province = serviceAddress?.state;
                            this._userSettingsService.setSelectedCanadianProvince(province);
                        }
                    }),
                    map(() => true),
                    catchError((error) => {
                        let errorMsg: IdentificationWithoutRadioWorkflowServiceError;
                        const errorCode = error?.error?.error?.errorCode ?? '';
                        if (error?.status === 401 && errorCode) {
                            switch (errorCode) {
                                case 'UNAUTHENTICATED_CUSTOMER':
                                    errorMsg = 'user not logged in';
                                    break;
                                default:
                                    errorMsg = 'network error';
                            }
                        } else {
                            errorMsg = 'network error';
                        }
                        return throwError(errorMsg);
                    })
                );
            }),
            catchError((error) => throwError(error))
        );
    }
}
