import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { concatMap, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { LoadAccountFromTokenWithTypeWorkflowService, getAccountServiceAddressState } from '@de-care/domains/account/state-account';
import { LoadOffersCustomerAddForStreamingWithCmsContentWorkflow } from '@de-care/domains/offers/state-offers-with-cms';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { initTransactionId, setSelectedPlanCode, setSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';
import {
    behaviorEventReactionCustomerInfoAuthenticationType,
    behaviorEventReactionForCustomerType,
    behaviorEventReactionForTransactionType,
} from '@de-care/shared/state-behavior-events';

export type LoadPurchaseDataForMrdFromTokenWorkflowErrors = 'system';

@Injectable({ providedIn: 'root' })
export class LoadPurchaseDataForMrdFromTokenWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadAccountFromTokenWithTypeWorkflowService: LoadAccountFromTokenWithTypeWorkflowService,
        private readonly _loadOffersCustomerAddForStreamingWithCmsContentWorkflow: LoadOffersCustomerAddForStreamingWithCmsContentWorkflow
    ) {}

    build(): Observable<boolean> {
        return this._store.select(getNormalizedQueryParams).pipe(
            take(1),
            concatMap(({ token }) =>
                this._loadAccountFromTokenWithTypeWorkflowService.build({
                    token,
                    tokenType: 'ACCOUNT',
                    student: false,
                })
            ),
            concatMap(() =>
                this._store.select(getAccountServiceAddressState).pipe(
                    take(1),
                    concatMap((province) => {
                        this._store.dispatch(setSelectedProvinceCode({ provinceCode: province }));
                        return this._loadOffersCustomerAddForStreamingWithCmsContentWorkflow.build({ province });
                    })
                )
            ),
            withLatestFrom(this._store.select(getFirstOfferPlanCode)),
            tap(([, planCode]) => {
                this._store.dispatch(setSelectedPlanCode({ planCode }));
            }),
            mapTo(true),
            tap(() => this._store.dispatch(initTransactionId())),
            tap(() => this._store.dispatch(pageDataFinishedLoading())),
            tap(() => {
                this._store.dispatch(behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'TOKENIZED_ENTRY' }));
                this._store.dispatch(behaviorEventReactionForCustomerType({ customerType: 'SXIR_ADD_SUBSCRIPTION' }));
                this._store.dispatch(behaviorEventReactionForTransactionType({ transactionType: 'ADD_SUBSCRIPTION' }));
            })
        );
    }
}
