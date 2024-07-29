import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { LoadCustomerOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';

@Injectable({ providedIn: 'root' })
export class LoadOffersForMrdWorkflowService implements DataWorkflow<{ retrieveFallbackOffer?: boolean }, boolean> {
    constructor(
        private readonly _store: Store,
        // TODO: change this to the new LoadCustomerOffersForMrdWithCmsContent that will be created
        private readonly _loadCustomerOffersWithCmsContent: LoadCustomerOffersWithCmsContent
    ) {}

    build({ retrieveFallbackOffer = false }: { retrieveFallbackOffer?: boolean }): Observable<boolean> {
        // TODO: do offers load logic
        return of(true);
    }
}
