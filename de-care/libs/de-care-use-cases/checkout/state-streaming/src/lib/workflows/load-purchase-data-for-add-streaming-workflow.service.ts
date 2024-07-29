import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { getAccountServiceAddressState, LoadAccountWorkflowService } from '@de-care/domains/account/state-account';
import { LoadOffersCustomerAddForStreamingWithCmsContentWorkflow } from '@de-care/domains/offers/state-offers-with-cms';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { initTransactionId, setSelectedPlanCode, setSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';
import {
    behaviorEventReactionCustomerInfoAuthenticationType,
    behaviorEventReactionFeatureTransactionStarted,
    behaviorEventReactionForCustomerType,
    behaviorEventReactionForTransactionType,
} from '@de-care/shared/state-behavior-events';
import { LoadAllPackageDescriptionsWorkflowService } from '@de-care/domains/offers/state-package-descriptions';
import { LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';
import { loadCardBinRanges } from '@de-care/domains/utility/state-card-bin-ranges';

export type LoadPurchaseDataForAddStreamingnWorkflowErrors = 'system';

@Injectable({ providedIn: 'root' })
export class LoadPurchaseDataForAddStreamingWorkflowService implements DataWorkflow<void, boolean> {
    private readonly _loadEnvInfo$ = this._loadEnvironmentInfoWorkflowService.build();
    private readonly _updateUseCase$ = this._updateUsecaseWorkflowService.build({ useCase: 'ADD_STREAMING' }).pipe(map(() => true));

    constructor(
        private readonly _store: Store,
        private readonly _loadAccountWorkflowService: LoadAccountWorkflowService,
        private readonly _loadOffersCustomerAddForStreamingWithCmsContentWorkflow: LoadOffersCustomerAddForStreamingWithCmsContentWorkflow,
        private readonly _loadAllPackageDescriptionsWorkflowService: LoadAllPackageDescriptionsWorkflowService,
        private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService,
        private readonly _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService
    ) {}

    build(): Observable<boolean> {
        return this._loadEnvInfo$.pipe(
            tap(() => {
                this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'addstreaming' }));
                this._store.dispatch(loadCardBinRanges());
                this._loadAllPackageDescriptionsWorkflowService.build().subscribe();
            }),
            concatMap(() => this._updateUseCase$),
            concatMap(() => this._loadAccountWorkflowService.build({})),
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
            tap(() => {
                this._store.dispatch(behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'TOKENIZED_ENTRY' }));
                this._store.dispatch(behaviorEventReactionForCustomerType({ customerType: 'SXIR_ADD_SUBSCRIPTION' }));
                this._store.dispatch(behaviorEventReactionForTransactionType({ transactionType: 'ADD_SUBSCRIPTION' }));
            })
        );
    }
}
