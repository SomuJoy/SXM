import { Injectable } from '@angular/core';
import { LoadAllPackageDescriptionsWorkflowService } from '@de-care/domains/offers/state-package-descriptions';
import { loadCardBinRanges } from '@de-care/domains/utility/state-card-bin-ranges';
import { LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';
import { behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { iif, Observable, of } from 'rxjs';
import { concatMap, map, switchMap, take, tap } from 'rxjs/operators';
import { getOrganicSelectedOfferViewModel } from '../state/public.selectors';
import { getOrganicPurchaseDataHasBeenLoaded } from '../state/selectors';
import { LoadPurchaseDataWorkflowErrors, LoadPurchaseDataWorkflowService } from './load-purchase-data-workflow.service';

export type LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors = LoadPurchaseDataWorkflowErrors;

@Injectable({ providedIn: 'root' })
export class LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService implements DataWorkflow<void, unknown> {
    constructor(
        private readonly _store: Store,
        private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService,
        private readonly _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService,
        private readonly _loadAllPackageDescriptionsWorkflowService: LoadAllPackageDescriptionsWorkflowService,
        private readonly _loadPurchaseDataWorkflowService: LoadPurchaseDataWorkflowService
    ) {}

    build(): Observable<unknown> {
        return this._store.select(getOrganicPurchaseDataHasBeenLoaded).pipe(
            take(1),
            switchMap((alreadyLoaded) =>
                iif(
                    () => alreadyLoaded,
                    of(true),
                    this._loadEnvironmentInfoWorkflowService.build().pipe(
                        // Async load what we can
                        tap(() => {
                            this._store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'checkoutstreamingorganicvariant2' }));
                            this._store.dispatch(loadCardBinRanges());
                            this._loadAllPackageDescriptionsWorkflowService.build().subscribe();
                        }),
                        switchMap(() => this._updateUsecaseWorkflowService.build({ useCase: 'STREAMING_ORGANIC' }).pipe(map(() => true))),
                        switchMap(() => this._loadPurchaseDataWorkflowService.build())
                    )
                )
            ),
            concatMap(() => this._store.select(getOrganicSelectedOfferViewModel).pipe(take(1)))
        );
    }
}
