import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { InitializeDataSourceWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { StartTransactionSessionWorkflowService } from '@de-care/domains/utility/state-update-usecase';
import { concatMap, map, switchMap, take } from 'rxjs/operators';
import { LoadOffersAtlasWorkflowService } from '@de-care/domains/offers/state-offers';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import { select, Store } from '@ngrx/store';
import { getOffersInfoWorkflowRequest } from '../state/selectors';

@Injectable({ providedIn: 'root' })
export class LoadOffersForAnonymousUserWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _initializeDataSourceWorkflowService: InitializeDataSourceWorkflowService,
        private readonly _startTransactionSessionWorkflowService: StartTransactionSessionWorkflowService,
        private readonly _loadOffersAtlasWorkflowService: LoadOffersAtlasWorkflowService,
        private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService,
        private readonly _store: Store
    ) {}

    build(): Observable<boolean> {
        return this._initializeDataSourceWorkflowService.build().pipe(
            switchMap(() =>
                this._startTransactionSessionWorkflowService
                    .build({
                        useCase: 'STREAMING_ORGANIC',
                        identifiedUser: false,
                    })
                    .pipe(map(() => true))
            ),
            switchMap(() => this._loadOffersAtlasWorkflowService.build()),
            // TODO: Get first offer planCode and store in feature state

            concatMap(() => this._store.pipe(select(getOffersInfoWorkflowRequest), take(1))),
            switchMap((request) => this._loadOffersInfoWorkflowService.build(request)),
            map(() => true)
        );
    }
}
