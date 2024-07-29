import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { CustomerInfoCollectionWorkflowService } from '@de-care/domains/account/state-branded-data-collection';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { Store } from '@ngrx/store';
import { concatMap, take, tap } from 'rxjs/operators';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';

@Injectable({ providedIn: 'root' })
export class InfoCustomerCollectionWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _customerInfoCollectionWorkflowService: CustomerInfoCollectionWorkflowService,
        private readonly _store: Store,
        private _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService
    ) {}

    build(): Observable<boolean> {
        return this._updateUsecaseWorkflowService.build({ useCase: 'BRANDED_DATA_COLLECTION' }).pipe(
            concatMap(() => this._store.select(getNormalizedQueryParams).pipe(take(1))),
            concatMap(({ token }) =>
                this._customerInfoCollectionWorkflowService
                    .build({ token, tokenType: 'BRANDED_DATA_COLLECTION' })
                    .pipe(tap((resp) => resp && this._store.dispatch(pageDataFinishedLoading())))
            )
        );
    }
}
