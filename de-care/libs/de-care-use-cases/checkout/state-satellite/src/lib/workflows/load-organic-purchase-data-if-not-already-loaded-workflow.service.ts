import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { iif, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';
import { LoadAllPackageDescriptionsWorkflowService } from '@de-care/domains/offers/state-package-descriptions';
import { concatMap, map, switchMap, take, tap } from 'rxjs/operators';
import { getOrganicPurchaseDataHasBeenLoaded } from '../state/selectors';
import { loadCardBinRanges } from '@de-care/domains/utility/state-card-bin-ranges';
import { getOrganicOfferPresentmentPageViewModel } from '../state/public.selectors';
import { LoadPurchaseDataWorkflowErrors, LoadPurchaseDataWorkflowService } from './load-purchase-data-workflow.service';

export type LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors = LoadPurchaseDataWorkflowErrors;

@Injectable({ providedIn: 'root' })
export class LoadOrganicPurchaseDataIfNotAlreadyLoadedWorkflowService implements DataWorkflow<void, unknown> {
    constructor(
        private readonly _store: Store,
        private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService,
        private readonly _updateUseCaseWorkflowService: UpdateUsecaseWorkflowService,
        private readonly _loadAllPackageDescriptionsWorkflowService: LoadAllPackageDescriptionsWorkflowService,
        private readonly _loadPurchaseDataWorkflowService: LoadPurchaseDataWorkflowService
    ) {}

    private _loadEnvInfo$ = this._loadEnvironmentInfoWorkflowService.build();
    private _updateUseCase$ = this._updateUseCaseWorkflowService.build({ useCase: 'SATELLITE_ORGANIC' }).pipe(map(() => true));
    private _loadPurchaseData$ = this._loadPurchaseDataWorkflowService.build();

    build(): Observable<unknown> {
        return this._store.select(getOrganicPurchaseDataHasBeenLoaded).pipe(
            take(1),
            switchMap((alreadyLoaded) =>
                iif(
                    () => alreadyLoaded,
                    of(true),
                    this._loadEnvInfo$.pipe(
                        // Async load what we can
                        tap(() => {
                            this._store.dispatch(loadCardBinRanges());
                            this._loadAllPackageDescriptionsWorkflowService.build().subscribe();
                        }),
                        switchMap(() => this._updateUseCase$),
                        switchMap(() => this._loadPurchaseData$)
                    )
                )
            ),
            concatMap(() => this._store.select(getOrganicOfferPresentmentPageViewModel).pipe(take(1)))
        );
    }
}
