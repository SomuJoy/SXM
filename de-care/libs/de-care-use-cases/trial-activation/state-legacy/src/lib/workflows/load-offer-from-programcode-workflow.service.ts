import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { withLatestFrom, concatMap } from 'rxjs/operators';
import { Offer, selectOffer } from '@de-care/domains/offers/state-offers';
import { LoadOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';

interface WorkflowRequest {
    streaming: boolean;
    student: boolean;
    programCode?: string;
}

@Injectable({ providedIn: 'root' })
export class LoadOfferFromProgramCodeWorkflowService implements DataWorkflow<WorkflowRequest, Offer> {
    constructor(private readonly _store: Store, private readonly _loadOffersWithCmsContent: LoadOffersWithCmsContent) {}

    build(request: WorkflowRequest) {
        return this._loadOffersWithCmsContent.build(request).pipe(
            withLatestFrom(this._store.pipe(select(selectOffer))),
            concatMap(([_, offer]) => of(offer))
        );
    }
}
