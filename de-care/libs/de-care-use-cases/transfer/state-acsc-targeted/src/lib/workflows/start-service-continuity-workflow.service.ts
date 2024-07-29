import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatMap, mergeMap, take, withLatestFrom, tap } from 'rxjs/operators';
import { getDataForServiceContinuity, getIsLoggedIn, getRadioIdToReplace, getProgramCode, getMarketingPromoCode } from '../state/selectors/state.selectors';
import { SetSelectedSubscriptionIdWorkflowService, LoadAccountFromAccountDataWorkflow, getAccountServiceAddress } from '@de-care/domains/account/state-account';
import { UserSettingsService, SettingsService } from '@de-care/settings';
import { LoadACSCOffersWorkflowService } from '@de-care/domains/offers/state-offers';
import { getFetchOffers } from '../state/selectors/public.selectors';

interface WorkflowRequest {
    trialRadioId: string;
}

@Injectable({ providedIn: 'root' })
export class StartServiceContinuityWorkflowService implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow,
        private readonly _settingsService: SettingsService,
        private readonly _userSettingsService: UserSettingsService,
        private readonly _setSelectedSubscriptionIdWorkflowService: SetSelectedSubscriptionIdWorkflowService,
        private readonly _loadACSCOffersWorkflowService: LoadACSCOffersWorkflowService
    ) {}

    build({ trialRadioId }): Observable<boolean> {
        return this._store.pipe(
            select(getDataForServiceContinuity),
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
            withLatestFrom(
                this._store.pipe(select(getRadioIdToReplace)),
                this._store.pipe(select(getProgramCode)),
                this._store.pipe(select(getMarketingPromoCode)),
                this._store.pipe(select(getFetchOffers))
            ),
            mergeMap(([, radioIdToReplace, programCode, marketingPromoCode, fetchOffers]) => {
                return fetchOffers
                    ? this._loadACSCOffersWorkflowService.build({
                          trialRadioId,
                          selfPayRadioId: radioIdToReplace,
                          accountConsolidation: false,
                          programCode,
                          marketingPromoCode,
                      })
                    : of(true);
            })
        );
    }
}
