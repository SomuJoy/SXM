import { Injectable } from '@angular/core';
import { SetSelectedSubscriptionIdWorkflowService, LoadAccountFromAccountDataWorkflow, getAccountServiceAddress } from '@de-care/domains/account/state-account';
import { ConsolidateAccountWorkflowService } from '@de-care/domains/subscriptions/state-trial-activation-account-consolidate';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatMap, mapTo, mergeMap, take, withLatestFrom, tap } from 'rxjs/operators';
import { getDataForAccountConsolidate, getIsLoggedIn, getACAccountDataRequest } from '../state/selectors/state.selectors';
import { SettingsService, UserSettingsService } from '@de-care/settings';

@Injectable({ providedIn: 'root' })
export class StartAccountConsolidationWorkflowService implements DataWorkflow<null, null> {
    constructor(
        private readonly _store: Store,
        private readonly _consolidateAccountWorkflowService: ConsolidateAccountWorkflowService,
        private readonly _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow,
        private readonly _settingsService: SettingsService,
        private readonly _userSettingsService: UserSettingsService,
        private readonly _setSelectedSubscriptionIdWorkflowService: SetSelectedSubscriptionIdWorkflowService
    ) {}

    build(): Observable<null> {
        return this._store.pipe(
            select(getACAccountDataRequest),
            withLatestFrom(this._store.pipe(select(getIsLoggedIn))),
            take(1),
            concatMap(([request, isLoggedIn]) => {
                return isLoggedIn
                    ? of(null)
                    : this._loadAccountFromAccountDataWorkflow.build(request).pipe(
                          withLatestFrom(this._store.pipe(select(getAccountServiceAddress))),
                          tap(([, serviceAddress]) => {
                              if (this._settingsService.isCanadaMode) {
                                  const province = serviceAddress?.state;
                                  this._userSettingsService.setSelectedCanadianProvince(province);
                              }
                          })
                      );
            }),
            mergeMap(() => {
                return this._setSelectedSubscriptionIdWorkflowService.build();
            }),
            withLatestFrom(this._store.pipe(select(getDataForAccountConsolidate))),
            concatMap(([, request]) => {
                return this._consolidateAccountWorkflowService.build(request);
            }),
            mapTo(null)
        );
    }
}
