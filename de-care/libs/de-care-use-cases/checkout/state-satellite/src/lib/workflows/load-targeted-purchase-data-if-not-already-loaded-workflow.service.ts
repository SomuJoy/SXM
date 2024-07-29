import { Injectable } from '@angular/core';
import { LoadAllPackageDescriptionsWorkflowService } from '@de-care/domains/offers/state-package-descriptions';
import { loadCardBinRanges } from '@de-care/domains/utility/state-card-bin-ranges';
import { LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { iif, Observable, of } from 'rxjs';
import { concatMap, map, switchMap, take, tap } from 'rxjs/operators';
import { getTargetedSelectedOfferViewModel } from '../state/public.selectors';
import { getTargetedPurchaseDataHasBeenLoaded } from '../state/selectors';
import { LoadPurchaseDataForTargetedWorkflowService, LoadPurchaseDataForTargetedWorkflowErrors } from './load-purchase-data-for-targeted-workflow.service';

export type LoadTargetedPurchaseDataIfNotAlreadyLoadedWorkflowServiceErrors = LoadPurchaseDataForTargetedWorkflowErrors;

@Injectable({ providedIn: 'root' })
export class LoadTargetedPurchaseDataIfNotAlreadyLoadedWorkflowService implements DataWorkflow<void, unknown> {
    constructor(
        private readonly _store: Store,
        private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService,
        private readonly _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService,
        private readonly _loadAllPackageDescriptionsWorkflowService: LoadAllPackageDescriptionsWorkflowService,
        private readonly _loadPurchaseDataForTargetedWorkflowService: LoadPurchaseDataForTargetedWorkflowService
    ) {}

    private _loadEnvInfo$ = this._loadEnvironmentInfoWorkflowService.build();
    private _updateUseCase$ = this._updateUsecaseWorkflowService.build({ useCase: 'SATELLITE_TARGETED' }).pipe(map(() => true));
    private _loadPurchaseData$ = this._loadPurchaseDataForTargetedWorkflowService.build();

    build(): Observable<unknown> {
        return this._store.select(getTargetedPurchaseDataHasBeenLoaded).pipe(
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
            concatMap(() => this._store.select(getTargetedSelectedOfferViewModel).pipe(take(1)))
        );
    }
}
