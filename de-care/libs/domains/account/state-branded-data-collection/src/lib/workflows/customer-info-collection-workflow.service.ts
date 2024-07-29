import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BrandedDataCollectionService, BrandedDataCollectionRequest, BrandedDataCollectionResponse } from '../data-services/branded-data-collection.service';
import { setCustomerDataCollection } from '../state/actions';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class CustomerInfoCollectionWorkflowService implements DataWorkflow<BrandedDataCollectionRequest, boolean> {
    constructor(private readonly _brandedDataCollectionService: BrandedDataCollectionService, private readonly _store: Store) {}

    build(request: BrandedDataCollectionRequest): Observable<boolean> {
        return this._brandedDataCollectionService.brandedDataCollection(request).pipe(
            tap((customerDataCollection) => this._store.dispatch(setCustomerDataCollection({ customerDataCollection }))),
            map(() => true)
        );
    }

    // TODO: add error catch to send behavior event
}
